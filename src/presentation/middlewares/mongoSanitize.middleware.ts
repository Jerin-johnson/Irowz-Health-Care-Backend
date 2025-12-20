import mongoSanitize from "express-mongo-sanitize";

export const mongoSanitizeMiddleware = mongoSanitize({
  replaceWith: "_", // replaces $ and . with _
});
