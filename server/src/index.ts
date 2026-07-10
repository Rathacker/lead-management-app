import "dotenv/config";
// Patches Express so errors thrown in async route handlers are forwarded to the
// error-handling middleware instead of becoming unhandled rejections (which
// would crash the process). Must be imported before routes are registered.
import "express-async-errors";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { authRouter } from "./routes/auth";
import { leadsRouter } from "./routes/leads";
import { settingsRouter } from "./routes/settings";
import { swaggerSpec } from "./swagger";

const app = express();

// CORS_ORIGIN may be "*" or a comma-separated allow-list of origins.
const corsOrigin = process.env.CORS_ORIGIN ?? "*";
app.use(
  cors({
    origin: corsOrigin === "*" ? true : corsOrigin.split(",").map((o) => o.trim()),
  }),
);
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/auth", authRouter);
app.use("/api/leads", leadsRouter);
app.use("/api/settings", settingsRouter);

app.use((_req, res) => res.status(404).json({ error: "Not found" }));

// Global error handler: any error thrown in a route is caught here and returned
// as a 500 (or a mapped status) so a single bad request can never crash the server.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const port = Number(process.env.PORT ?? 4000);
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
  console.log(`Swagger docs at http://localhost:${port}/api-docs`);
});
