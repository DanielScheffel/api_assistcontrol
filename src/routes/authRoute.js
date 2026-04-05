import express from 'express';
import { loginController } from '../controllers/authController.js';
import { loginValidator } from '../validators/authValidator.js';
import { validationMiddleware } from '../middlewares/validationMiddleware.js';

const router = express.Router();

router.post("/login",
    loginValidator,
    validationMiddleware,
    loginController
);

export default router;