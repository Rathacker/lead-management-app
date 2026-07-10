import { Router } from "express";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "../prisma";
import { requireAuth } from "../middleware/auth";

export const leadsRouter = Router();
leadsRouter.use(requireAuth);

const STATUS_VALUES = ["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST"] as const;
type Status = (typeof STATUS_VALUES)[number];

const leadInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  company: z.string().optional().nullable(),
  email: z.string().email().optional().nullable().or(z.literal("")),
  phone: z.string().optional().nullable(),
  source: z.string().optional().nullable(),
  status: z.enum(STATUS_VALUES).optional(),
  notes: z.string().optional().nullable(),
});

function buildWhere(search?: string, status?: string): Prisma.LeadWhereInput {
  const where: Prisma.LeadWhereInput = {};
  if (status && STATUS_VALUES.includes(status as Status)) {
    where.status = status as Status;
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { company: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }
  return where;
}

function emptyCounts(): Record<Status, number> {
  return { NEW: 0, CONTACTED: 0, QUALIFIED: 0, WON: 0, LOST: 0 };
}

/**
 * @openapi
 * /api/leads/dashboard:
 *   get:
 *     summary: Total and per-status lead counts (computed in the database)
 *     tags: [Leads]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Dashboard stats
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/DashboardStats' }
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
leadsRouter.get("/dashboard", async (_req, res) => {
  const [total, grouped] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.groupBy({ by: ["status"], _count: { status: true } }),
  ]);
  const byStatus = emptyCounts();
  for (const row of grouped) byStatus[row.status] = row._count.status;
  res.json({ total, byStatus });
});

/**
 * @openapi
 * /api/leads/reports:
 *   get:
 *     summary: Pipeline report aggregates (all computed in the database)
 *     tags: [Leads]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Report aggregates by status and source with derived KPIs
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ReportData' }
 */
leadsRouter.get("/reports", async (_req, res) => {
  const [total, byStatusRows, bySourceRows] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.groupBy({ by: ["status"], _count: { status: true } }),
    prisma.lead.groupBy({ by: ["source"], _count: { source: true }, orderBy: { _count: { source: "desc" } } }),
  ]);

  const byStatus = emptyCounts();
  for (const row of byStatusRows) byStatus[row.status] = row._count.status;

  const bySource = bySourceRows
    .map((row) => ({ source: row.source ?? "Unknown", count: row._count.source }))
    .sort((a, b) => b.count - a.count);

  const won = byStatus.WON;
  const lost = byStatus.LOST;
  const decided = won + lost;
  const open = byStatus.NEW + byStatus.CONTACTED + byStatus.QUALIFIED;

  res.json({
    total,
    open,
    won,
    lost,
    winRate: decided ? Math.round((won / decided) * 100) : null,
    conversion: total ? Math.round((won / total) * 100) : null,
    byStatus,
    bySource,
  });
});

/**
 * @openapi
 * /api/leads:
 *   get:
 *     summary: List leads (server-side search, status filter, and pagination)
 *     tags: [Leads]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: search, schema: { type: string } }
 *       - { in: query, name: status, schema: { type: string, enum: [NEW, CONTACTED, QUALIFIED, WON, LOST] } }
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: pageSize, schema: { type: integer, default: 5 } }
 *     responses:
 *       200:
 *         description: Paginated leads envelope
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PaginatedLeads' }
 *   post:
 *     summary: Create a lead
 *     tags: [Leads]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/LeadInput' }
 *     responses:
 *       201:
 *         description: Lead created
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Lead' }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
leadsRouter.get("/", async (req, res) => {
  const { search, status } = req.query as { search?: string; status?: string };
  const page = Math.max(1, parseInt(String(req.query.page ?? "1"), 10) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(String(req.query.pageSize ?? "5"), 10) || 5));
  const where = buildWhere(search, status);

  const [total, data] = await Promise.all([
    prisma.lead.count({ where }),
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  res.json({
    data,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  });
});

leadsRouter.post("/", async (req, res) => {
  const parsed = leadInputSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const lead = await prisma.lead.create({
    data: { ...parsed.data, email: parsed.data.email || null },
  });
  res.status(201).json(lead);
});

/**
 * @openapi
 * /api/leads/{id}:
 *   get:
 *     summary: Get a lead by id
 *     tags: [Leads]
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string, format: uuid } }]
 *     responses:
 *       200:
 *         description: Lead found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Lead' }
 *       404:
 *         description: Lead not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *   put:
 *     summary: Update a lead (partial — only sent fields change)
 *     tags: [Leads]
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string, format: uuid } }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/LeadInput' }
 *     responses:
 *       200:
 *         description: Lead updated
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Lead' }
 *       404:
 *         description: Lead not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *   delete:
 *     summary: Delete a lead
 *     tags: [Leads]
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string, format: uuid } }]
 *     responses:
 *       204: { description: Lead deleted (no content) }
 *       404:
 *         description: Lead not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
leadsRouter.get("/:id", async (req, res) => {
  const lead = await prisma.lead.findUnique({ where: { id: req.params.id } });
  if (!lead) return res.status(404).json({ error: "Lead not found" });
  res.json(lead);
});

leadsRouter.put("/:id", async (req, res) => {
  const parsed = leadInputSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  // Only normalize fields actually present in the partial payload, so an
  // update that omits a field never wipes the stored value.
  const data = { ...parsed.data };
  if ("email" in data) data.email = data.email || null;

  try {
    const lead = await prisma.lead.update({
      where: { id: req.params.id },
      data,
    });
    res.json(lead);
  } catch {
    res.status(404).json({ error: "Lead not found" });
  }
});

leadsRouter.delete("/:id", async (req, res) => {
  try {
    await prisma.lead.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: "Lead not found" });
  }
});
