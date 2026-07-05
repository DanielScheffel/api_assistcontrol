import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { getProdutosController, 
    produtoController, 
    updateProdutoController, 
    deleteProdutoController } from '../controllers/produtoController.js';
import { produtoValidator } from '../validators/produtoValidator.js';
import { validationMiddleware } from '../middlewares/validationMiddleware.js';
import { permissionTypes } from '../middlewares/permissionMiddleware.js';


const router = express.Router();

router.get("/produtos",
    authMiddleware,
    getProdutosController
)

router.post("/cadastro-produto",
    authMiddleware,
    permissionTypes("Administrador", "Gerente"),
    produtoValidator,
    validationMiddleware,
    produtoController
)

router.put("/atualizar-produto/:produtoID",
    authMiddleware,
    permissionTypes("Administrador", "Gerente"),
    validationMiddleware,
    updateProdutoController
)

router.delete("/deletar-produto/:produtoID",
    authMiddleware,
    permissionTypes("Administrador", "Gerente"),
    deleteProdutoController
)

export default router;