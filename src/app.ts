import express from "express";
// import { mongoSanitizeMiddleware } from "./presentation/middlewares/mongoSanitize.middleware";
import { authRoute } from "./DI/auth";
import { hospitalAdminRoutes } from "./DI/hospitalAdmin";
import { errorHandler } from "./presentation/middlewares/errorHandle";
import { superAdminRoutes } from "./DI/superAdmin";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoute.register());
app.use("/api/hospital-admin", hospitalAdminRoutes.register());
app.use("/api/super-admin", superAdminRoutes.register());
app.use(errorHandler);

export default app;
