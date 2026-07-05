import express from 'express';

import { authMiddleware } from '../middlewares/authMiddleware.js';
import { lojaValidator } from '../validators/lojaValidator.js';
import { validationMiddleware } from '../middlewares/validationMiddleware.js';
import { deleteLojaController, 
    getLojasController, 
    lojaController, 
    updateLojaController } from '../controllers/lojaController.js';
import { permissionTypes } from '../middlewares/permissionMiddleware.js';

const router = express.Router();

router.get("/lojas",
    authMiddleware,
    getLojasController
)

router.post("/loja/nova-loja",
    authMiddleware,
    permissionTypes("Administrador", "Gerente"),
    lojaValidator,
    validationMiddleware,
    lojaController
)

router.put("/loja/editar-loja/:id_loja",
    authMiddleware,
    permissionTypes("Administrador", "Gerente"),
    updateLojaController
)

router.delete("/loja/deletar-loja/:id_loja",
    authMiddleware,
    permissionTypes("Administrador", "Gerente"),
    deleteLojaController
)

export default router;