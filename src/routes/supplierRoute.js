import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { supplierController } from '../controllers/supplierController.js';
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

export default router;