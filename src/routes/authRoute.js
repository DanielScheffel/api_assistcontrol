import express from 'express';
import { loginController } from '../controllers/authController.js';
import { loginValidator } from '../validators/authValidator.js';
import { validationMiddleware } from '../middlewares/validationMiddleware.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get("/me", 
    authMiddleware,
    (req, res) => {

    console.log(req.user);
    return res.status(200).json({
        message: "Acesso autorizado",
        id_usuario: req.user.id_usuario,
        nome: req.user.nome,
        email: req.user.email,
        tipo_usuario: req.user.tipo_usuario
    })
})

router.post("/login",
    loginValidator,
    validationMiddleware,
    loginController
);

export default router;