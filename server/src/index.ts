import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import session, { SessionOptions } from "express-session";
import helmet from "helmet";
import passport from "passport";
import swaggerUi from "swagger-ui-express";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import "./config/passport";
import { loggerMiddleware } from "./middleware/logger";
import authRoutes from "./routes/auth";
import mediaRoutes from "./routes/media";
import swaggerSpec from "./swagger";
import logger from "./utils/logger";

dotenv.config();

const app = express();
const PORT = env.PORT || 5000;

connectDB();

app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

app.use(loggerMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    },
  } as SessionOptions)
);

app.use(passport.initialize());
app.use(passport.session());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

app.use(limiter);

app.get("/health", (req: Request, res: Response) => {
  const healthCheck = {
    status: "ok",
    message: "OK",
    uptime: process.uptime(),
    timestamp: Date.now(),
    environment: env.NODE_ENV,
    version: process.env.npm_package_version || "1.0.0",
  };

  try {
    res.status(200).json(healthCheck);
    logger.info({ message: "Health check successful", data: healthCheck });
  } catch (error) {
    healthCheck.status = "error";
    healthCheck.message = (error as Error).message;
    res.status(503).json(healthCheck);
    logger.error({ message: "Health check failed", error });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    req: {
      method: req.method,
      url: req.url,
      headers: req.headers,
    },
  });
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
