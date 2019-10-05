import { Router } from "express";
import multer from "multer";
import multerConfig from "./config/multer";

import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";
import FileController from "./app/controllers/FileController";

import authMiddleware from "./app/middlewares/auth";

const upload = multer(multerConfig);
const routes = new Router();

routes.post("/user", UserController.store);
routes.post("/session", SessionController.store);

routes.use(authMiddleware);
routes.put("/user", UserController.update);

routes.post("/files", upload.single("file"), FileController.store);

export default routes;
