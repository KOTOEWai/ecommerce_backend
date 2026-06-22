import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import userRoutes from "./routes/userRoute";
import authRoutes from "./routes/authRoute";
import roleRoutes from "./routes/roleRoute";
import addressRoutes from "./routes/addressRoute";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(express.json());
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

const responseHandler = (_req: Request, res: Response, next: NextFunction) => {
  res.success = function (data, message = "Success", statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  };

  next();
};

app.use(responseHandler);

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Express server is running!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/addresses", addressRoutes);

app.use(errorHandler);

export default app;
