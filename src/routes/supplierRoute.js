import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { deleteSupplierController, 
    getSupplierByIdController, 
    getSuppliersController, 
    supplierController, 
    updateSupplierController } from '../controllers/supplierController.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';
import { supplierValidator } from '../validators/supplierValidator.js';
import { validationMiddleware } from '../middlewares/validationMiddleware.js';


const router = express.Router();

router.get("/fornecedores",
    authMiddleware,
    getSuppliersController
)

router.get("/:id",
    authMiddleware,
    getSupplierByIdController
)

router.post("/novo-fornecedor",
    authMiddleware,
    adminMiddleware,
    supplierValidator,
    validationMiddleware,
    supplierController
)

router.put("/atualizar-fornecedor/:supplierID",
    authMiddleware,
    adminMiddleware,
    updateSupplierController
)

router.delete("/deletar-fornecedor/:supplierID",
    authMiddleware,
    adminMiddleware,
    deleteSupplierController
)

export default router;