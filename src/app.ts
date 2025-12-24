import express from "express";
// import { mongoSanitizeMiddleware } from "./presentation/middlewares/mongoSanitize.middleware";
import { authRoute } from "./DI/auth";
import { hospitalAdminRoutes } from "./DI/hospitalAdmin";
import { errorHandler } from "./presentation/middlewares/errorHandle";

const app = express();

// global middlewares
app.use(express.json());

// routes
app.use("/api/auth", authRoute.register());
app.use("/api/hospital-admin", hospitalAdminRoutes.register());
app.use(errorHandler);

export default app;
