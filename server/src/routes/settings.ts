import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma";
import { requireAuth, AuthedRequest } from "../middleware/auth";

export const settingsRouter = Router();
settingsRouter.use(requireAuth);

const settingsSchema = z.object({
  theme: z.enum(["light", "dark"]),
  pageSize: z.number().int().positive().max(100),
  showAvatars: z.boolean(),
  confirmBeforeDelete: z.boolean(),
});

async function getOrCreate(userId: string) {
  return prisma.settings.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
}

/**
 * @openapi
 * /api/settings:
 *   get:
 *     summary: Get the current user's settings (created with defaults if absent)
 *     tags: [Settings]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Settings object
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Settings' }
 *   put:
 *     summary: Update the current user's settings
 *     tags: [Settings]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/SettingsInput' }
 *     responses:
 *       200:
 *         description: Updated settings
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Settings' }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
settingsRouter.get("/", async (req: AuthedRequest, res) => {
  const settings = await getOrCreate(req.userId as string);
  res.json(settings);
});

settingsRouter.put("/", async (req: AuthedRequest, res) => {
  const parsed = settingsSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  await getOrCreate(req.userId as string);
  const settings = await prisma.settings.update({
    where: { userId: req.userId as string },
    data: parsed.data,
  });
  res.json(settings);
});
