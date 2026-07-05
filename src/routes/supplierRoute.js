import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { deleteSupplierController, 
    getSupplierByIdController, 
    getSuppliersController, 
    supplierController, 
    updateSupplierController } from '../controllers/supplierController.js';
import { supplierValidator } from '../validators/supplierValidator.js';
import { permissionTypes } from '../middlewares/permissionMiddleware.js';
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
    permissionTypes("Administrador", "Gerente"),
    supplierValidator,
    validationMiddleware,
    supplierController
)

router.put("/atualizar-fornecedor/:supplierID",
    authMiddleware,
    permissionTypes("Administrador", "Gerente"),
    updateSupplierController
)

router.delete("/deletar-fornecedor/:supplierID",
    authMiddleware,
    permissionTypes("Administrador", "Gerente"),
    deleteSupplierController
)

export default router;