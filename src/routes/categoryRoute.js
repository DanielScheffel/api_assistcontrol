import express from "express";
import { categoryController, 
    deleteCategoryController, 
    getCategoriesController } from "../controllers/categoryController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/categorias",
    authMiddleware,
    getCategoriesController
)

router.post("/nova-categoria",
    authMiddleware,
    categoryController
)

router.delete("/deletar-categoria/:categoryID",
    authMiddleware,
    deleteCategoryController
)

export default router;