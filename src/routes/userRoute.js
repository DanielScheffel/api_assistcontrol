import express from 'express';
import { deleteUserController, 
    getUserByIdController, 
    getUsersController, 
    updateStatusUserController, 
    updateUserController, 
    userController } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { cadastroUsuarioValidator } from '../validators/userValidator.js';
import { validationMiddleware } from '../middlewares/validationMiddleware.js';
import { permissionTypes } from '../middlewares/permissionMiddleware.js';

const router = express.Router();

router.get("/usuarios",
    authMiddleware,
    permissionTypes("Administrador", "Gerente", "Funcionario"),
    getUsersController
)

router.get("/:id",
    authMiddleware,
    permissionTypes("Administrador", "Gerente", "Funcionario"),
    getUserByIdController
)

router.post("/cadastro-usuario",
    authMiddleware,
    permissionTypes("Administrador", "Gerente"),
    cadastroUsuarioValidator,
    validationMiddleware,
    userController
)

router.put("/atualizar-usuario/:userID",
    authMiddleware,
    permissionTypes("Administrador", "Gerente"),
    updateUserController
)

router.put("/atualizar-status/:userID",
    authMiddleware,
    permissionTypes("Administrador", "Gerente"),
    updateStatusUserController
)

router.delete("/delete-usuario/:userID",
    authMiddleware,
    permissionTypes("Administrador"),
    deleteUserController
)

export default router;