import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import routes from "./routes";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

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
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use("/api/v1", routes);

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "API is running" });
});

app.use(errorMiddleware);

export default app;
