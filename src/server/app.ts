import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import routes from "./routes";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

app.set("trust proxy", 1);

app.use(helmet());
app.use(
  cors({
    origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false, xForwardedForHeader: false, ip: false },
});
app.use(limiter);

app.use("/api/v1", routes);

app.get("/api/health", async (_req, res) => {
  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.$queryRawUnsafe("SELECT 1");
    res.json({ success: true, message: "API is running", db: "connected" });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown";
    console.error("Health check DB error:", msg);
    res.json({ success: true, message: "API is running", db: "error", dbError: msg });
  }
});

app.use(errorMiddleware);

export default app;
