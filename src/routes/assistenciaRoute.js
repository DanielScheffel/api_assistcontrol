import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { assistenciaValidator } from "../validators/assistenciaValidator.js";
import { validationMiddleware } from "../middlewares/validationMiddleware.js";
import {
  assistenciaController,
  getAssistenciaListController,
  updateStatusAssistenciaController,
  getAssistenciaByIdController,
  getSearchAssistenciaController,
} from "../controllers/assistenciaController.js";

import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get(
  "/lista-assistencia",
  authMiddleware,
  adminMiddleware,
  getAssistenciaListController,
);

router.get("/search",
    authMiddleware,
    adminMiddleware,
    getSearchAssistenciaController
)

router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  getAssistenciaByIdController,
);

router.post(
  "/cadastro-assistencia",
  authMiddleware,
  adminMiddleware,
  upload.array("imagens", 5),
  assistenciaValidator,
  validationMiddleware,
  assistenciaController,
);

router.patch(
  "/atualizar-status-assistencia/:id",
  authMiddleware,
  adminMiddleware,
  updateStatusAssistenciaController,
);

export default router;
