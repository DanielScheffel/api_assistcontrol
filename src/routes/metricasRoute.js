import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
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
import { permissionTypes } from "../middlewares/permissionMiddleware.js";

const router = express.Router();

router.get('/total',
    authMiddleware,
    permissionTypes("Administrador", "Gerente", "Funcionario"),
    getTotalAssistenciaController
)

router.get('/status',
    authMiddleware,
    permissionTypes("Administrador", "Gerente", "Funcionario"),
    getAssistenciasPorStatusController
)

router.get('/lojas',
    authMiddleware,
    permissionTypes("Administrador", "Gerente", "Funcionario"),
    getAssistenciasPorLojaController
)

router.get('/fornecedores',
    authMiddleware,
    permissionTypes("Administrador", "Gerente", "Funcionario"),
    getAssistenciasPorFornecedorController
)

router.get('/tempo-medio',
    authMiddleware,
    permissionTypes("Administrador", "Gerente", "Funcionario"),
    getTempoMedioResolucaoController
)

router.get('/valor-parado',
    authMiddleware,
    permissionTypes("Administrador", "Gerente", "Funcionario"),
    getValorTotalParadoController
)

router.get('/atrasadas',
    authMiddleware,
    permissionTypes("Administrador", "Gerente", "Funcionario"),
    getAssistenciasAtrasadasController
)

router.get('/mensal',
    authMiddleware,
    permissionTypes("Administrador", "Gerente", "Funcionario"),
    getAssistenciasPorMesController
)

router.get('/valor-parado-fornecedor',
    authMiddleware,
    permissionTypes("Administrador", "Gerente", "Funcionario"),
    getValorPorFornecedorController
)

router.get('/produtos-mais-assistencias',
    authMiddleware,
    permissionTypes("Administrador", "Gerente", "Funcionario"),
    getProdutosComMaisAssistenciasController
)

router.get('/taxa-conclusao',
    authMiddleware,
    permissionTypes("Administrador", "Gerente", "Funcionario"),
    getTaxaConclusaoController
)

export default router;