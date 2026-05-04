import express from 'express';

import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';
import { lojaValidator } from '../validators/lojaValidator.js';
import { validationMiddleware } from '../middlewares/validationMiddleware.js';
import { lojaController, updateLojaController } from '../controllers/lojaController.js';

const router = express.Router();

router.post("/loja/nova-loja",
    authMiddleware,
    adminMiddleware,
    lojaValidator,
    validationMiddleware,
    lojaController
)

router.put("/loja/editar-loja/:id_loja",
    authMiddleware,
    adminMiddleware,
    updateLojaController
)

export default router;