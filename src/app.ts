import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "reflect-metadata";
import { authRoute } from "./DI/auth";
import { hospitalAdminRoutes } from "./DI/hospitalAdmin";
import { errorHandler } from "./presentation/middlewares/errorHandle";
import { superAdminRoutes } from "./DI/superAdmin";
import { doctorRoutes } from "./DI/doctor";
import { patientRoutes } from "./DI/patient";
import { API_ROUTES } from "./presentation/constants/routes/api.constants.routes";
import { aiRoutes } from "./DI/ai";
import { viewPrivateFileRoutes } from "./DI/PrivateFile";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173", "https://irowzelite.shop", "https://www.irowzelite.shop"],
    credentials: true,
  })
);

app.use((req, res, next) => {
  console.log("---- Incoming Request ----");
  console.log("Method:", req.method);
  console.log("URL:", req.originalUrl);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  console.log("--------------------------");
  next();
});

app.use(API_ROUTES.AUTH, authRoute.register());
app.use(API_ROUTES.PATIENT, patientRoutes.register());
app.use(API_ROUTES.HOSPITAL_ADMIN, hospitalAdminRoutes.register());
app.use(API_ROUTES.DOCTOR, doctorRoutes.register());
app.use(API_ROUTES.SUPER_ADMIN, superAdminRoutes.register());
app.use("/api/ai", aiRoutes.register());
app.use("/api/private", viewPrivateFileRoutes.register());

app.use((req, res) => {
  res.status(404).json({ message: "Route not found check retry once more" });
});

app.use(errorHandler);

export default app;
