import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { getTotalAssistenciaController, 
    getAssistenciasPorStatusController,
    getAssistenciasPorLojaController,
    getAssistenciasPorFornecedorController,
    getTempoMedioResolucaoController,
    getValorTotalParadoController
} from "../controllers/metricasController.js";

const router = express.Router();

router.get('/total',
    authMiddleware,
    adminMiddleware,
    getTotalAssistenciaController
)

router.get('/status',
    authMiddleware,
    adminMiddleware,
    getAssistenciasPorStatusController
)

router.get('/lojas',
    authMiddleware,
    adminMiddleware,
    getAssistenciasPorLojaController
)

router.get('/fornecedores',
    authMiddleware,
    adminMiddleware,
    getAssistenciasPorFornecedorController
)

router.get('/tempo-medio',
    authMiddleware,
    adminMiddleware,
    getTempoMedioResolucaoController
)

router.get('/valor-parado',
    authMiddleware,
    adminMiddleware,
    getValorTotalParadoController
)

export default router;