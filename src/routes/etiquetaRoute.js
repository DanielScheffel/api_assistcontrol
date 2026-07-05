import express from 'express';
import { gerarEtiquetaController } from '../controllers/etiquetaController.js';
import { permissionTypes } from '../middlewares/permissionMiddleware.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/etiqueta/:id',
    authMiddleware,
    permissionTypes("Administrador", "Gerente", "Funcionario"),
    gerarEtiquetaController,
)

export default router;