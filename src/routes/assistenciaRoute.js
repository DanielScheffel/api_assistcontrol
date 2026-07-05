import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
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
import { permissionTypes } from "../middlewares/permissionMiddleware.js";

const router = express.Router();

router.get(
  "/lista-assistencia",
  authMiddleware,
  permissionTypes("Administrador", "Gerente", "Funcionario"),
  getAssistenciaListController,
);

router.get("/search",
    authMiddleware,
    permissionTypes("Administrador", "Gerente", "Funcionario"),
    getSearchAssistenciaController
)

router.get(
  "/:id",
  authMiddleware,
  permissionTypes("Administrador", "Gerente", "Funcionario"),
  getAssistenciaByIdController,
);

router.post(
  "/cadastro-assistencia",
  authMiddleware,
  permissionTypes("Administrador", "Gerente", "Funcionario"),
  upload.array("imagens", 5),
  assistenciaValidator,
  validationMiddleware,
  assistenciaController,
);

router.patch(
  "/atualizar-status-assistencia/:id",
  authMiddleware,
  permissionTypes("Administrador", "Gerente", "Funcionario"),
  updateStatusAssistenciaController,
);

export default router;
