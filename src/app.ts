import express from "express";
// import { mongoSanitizeMiddleware } from "./presentation/middlewares/mongoSanitize.middleware";
import { authRoute } from "./DI/auth";
import { errorHandler } from "./presentation/middlewares/errorHandle";

const app = express();

// global middlewares
app.use(express.json());
// app.use(mongoSanitizeMiddleware);

// routes
app.use("/api/auth", authRoute.register());

app.use(errorHandler);

export default app;
