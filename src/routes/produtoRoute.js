import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { getProdutosController, produtoController } from '../controllers/produtoController.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';
import { produtoValidator } from '../validators/produtoValidator.js';
import { validationMiddleware } from '../middlewares/validationMiddleware.js';


const router = express.Router();

router.get("/produtos",
    authMiddleware,
    getProdutosController
)

router.post("/cadastro-produto",
    authMiddleware,
    adminMiddleware,
    produtoValidator,
    validationMiddleware,
    produtoController
)







export default router;