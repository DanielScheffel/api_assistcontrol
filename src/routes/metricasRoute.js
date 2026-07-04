import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { getTotalAssistenciaController, 
    getAssistenciasPorStatusController,
    getAssistenciasPorLojaController,
    getAssistenciasPorFornecedorController,
    getTempoMedioResolucaoController,
    getValorTotalParadoController,
    getAssistenciasAtrasadasController,
    getAssistenciasPorMesController,
    getValorPorFornecedorController,
    getProdutosComMaisAssistenciasController,
    getTaxaConclusaoController
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

router.get('/atrasadas',
    authMiddleware,
    adminMiddleware,
    getAssistenciasAtrasadasController
)

router.get('/mensal',
    authMiddleware,
    adminMiddleware,
    getAssistenciasPorMesController
)

router.get('/valor-parado-fornecedor',
    authMiddleware,
    adminMiddleware,
    getValorPorFornecedorController
)

router.get('/produtos-mais-assistencias',
    authMiddleware,
    adminMiddleware,
    getProdutosComMaisAssistenciasController
)

router.get('/taxa-conclusao',
    authMiddleware,
    adminMiddleware,
    getTaxaConclusaoController
)

export default router;