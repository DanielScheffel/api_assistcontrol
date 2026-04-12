import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { deleteSupplierController, supplierController, updateSupplierController } from '../controllers/supplierController.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';
import { supplierValidator } from '../validators/supplierValidator.js';
import { validationMiddleware } from '../middlewares/validationMiddleware.js';

const router = express.Router();

router.post("/novo-fornecedor",
    authMiddleware,
    adminMiddleware,
    supplierValidator,
    validationMiddleware,
    supplierController
)

router.put("/atualizar-fornecedor/:supplierID",
    authMiddleware,
    updateSupplierController
)

router.delete("/deletar-fornecedor/:supplierID",
    authMiddleware,
    deleteSupplierController
)

export default router;