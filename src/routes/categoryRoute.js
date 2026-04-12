import express from "express";
import { categoryController, deleteCategoryController } from "../controllers/categoryController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/nova-categoria",
    authMiddleware,
    categoryController
)

router.delete("/deletar-categoria/:categoryID",
    authMiddleware,
    deleteCategoryController
)

export default router;