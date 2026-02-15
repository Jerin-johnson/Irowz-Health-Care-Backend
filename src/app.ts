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
// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "https://desire-introspectible-monroe.ngrok-free.dev",
//       "https://detail-legislature-boating-jesse.trycloudflare.com",
//       "http://localhost:3000",
//       "https://irowz-health-care-frontend-a6ap-hf5v81rn3.vercel.app",
//       "https://irowz-health-care-frontend-a6ap-hf5v81rn3.vercel.app",
//     ],
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://irowz-health-care-frontend-a6ap-hf5v81rn3.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", cors());

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
app.use(errorHandler);

export default app;
