import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { permissionTypes } from "../middlewares/permissionMiddleware.js";
import { getRelatorioAssistenciasController, baixarRelatorioAssistenciasPDF } from "../controllers/relatorioController.js";

const router = express.Router();

router.get('/assistencias/pdf',
    authMiddleware,
    permissionTypes("Administrador", "Gerente", "Funcionario"),
    baixarRelatorioAssistenciasPDF
)

router.get('/assistencias',
    authMiddleware,
    permissionTypes("Administrador", "Gerente", "Funcionario"),
    getRelatorioAssistenciasController
)

export default router;