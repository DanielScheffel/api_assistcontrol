import { body } from "express-validator";

export const loginValidator = [

    body("email")
        .notEmpty().withMessage("O campo email é obrigatório")
        .isEmail().withMessage("E-mail inválido"),
        
    body("senha")
        .notEmpty().withMessage("O campo senha é obrigatório")
]