import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { getRelatorioAssistenciasController, baixarRelatorioAssistenciasPDF } from "../controllers/relatorioController.js";

const router = express.Router();

router.get('/assistencias/pdf',
    authMiddleware,
    adminMiddleware,
    baixarRelatorioAssistenciasPDF
)

router.get('/assistencias',
    authMiddleware,
    adminMiddleware,
    getRelatorioAssistenciasController
)

export default router;