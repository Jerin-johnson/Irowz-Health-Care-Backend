import { GenerateSignedUrlUseCase } from "../applications/usecases/viewPrivateFile/GenerateSignedUrlUseCase";
import { ViewPrivateFileController } from "../presentation/controllers/viewPrivateFile/ViewPrivateFile";
import { ViewPrivateFileRoutes } from "../presentation/routes/private.file.routes";
import { s3FileStorage } from "./service";

const generateSignedUrlUseCase = new GenerateSignedUrlUseCase(s3FileStorage);
const viewPrivateFileController = new ViewPrivateFileController(generateSignedUrlUseCase);

export const viewPrivateFileRoutes = new ViewPrivateFileRoutes(viewPrivateFileController);
