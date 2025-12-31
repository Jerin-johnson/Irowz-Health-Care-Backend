import express from "express";
// import { mongoSanitizeMiddleware } from "./presentation/middlewares/mongoSanitize.middleware";
import { authRoute } from "./DI/auth";
import { hospitalAdminRoutes } from "./DI/hospitalAdmin";
import { errorHandler } from "./presentation/middlewares/errorHandle";
import { superAdminRoutes } from "./DI/superAdmin";
import cookieParser from "cookie-parser";
import cors from "cors";
import { doctorRoutes } from "./DI/doctor";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use((req, res, next) => {
  console.log("---- Incoming Request ----");
  console.log("Method:", req.method);
  console.log("URL:", req.originalUrl);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  console.log("--------------------------");
  next();
});

app.use("/api/auth", authRoute.register());
app.use("/api/hospital-admin", hospitalAdminRoutes.register());
app.use("/api/doctor", doctorRoutes.register());
app.use("/api/super-admin", superAdminRoutes.register());
app.use(errorHandler);

export default app;
