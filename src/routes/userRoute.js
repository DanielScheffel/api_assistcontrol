import express from 'express';
import { updateUserController, userController } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';
import { cadastroUsuarioValidator } from '../validators/userValidator.js';
import { validationMiddleware } from '../middlewares/validationMiddleware.js';

const router = express.Router();

router.post("/cadastro-usuario",
    authMiddleware,
    adminMiddleware,
    cadastroUsuarioValidator,
    validationMiddleware,
    userController
)

router.put("/atualizar-usuario/:userID",
    authMiddleware,
    updateUserController
)

export default router;