import "dotenv/config";
import express from "express";
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

const port = Number(process.env.PORT ?? 4000);
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
  console.log(`Swagger docs at http://localhost:${port}/api-docs`);
});
