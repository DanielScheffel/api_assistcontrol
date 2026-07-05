import express from "express";
import { categoryController, 
    deleteCategoryController, 
    getCategoriesController } from "../controllers/categoryController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { permissionTypes } from "../middlewares/permissionMiddleware.js";

const router = express.Router();

router.get("/categorias",
    authMiddleware,
    permissionTypes("Administrador", "Gerente", "Funcionario"),
    getCategoriesController
)

router.post("/nova-categoria",
    authMiddleware,
    permissionTypes("Administrador", "Gerente"),
    categoryController
)

router.delete("/deletar-categoria/:categoryID",
    authMiddleware,
    permissionTypes("Administrador", "Gerente"),
    deleteCategoryController
)

export default router;