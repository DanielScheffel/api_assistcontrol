import { body } from "express-validator";

export const supplierValidator = [
    body("marca")
        .notEmpty().withMessage("A marca do fornecedor é obrigatório"),
    body("contato")
        .notEmpty().withMessage("O contato do fornecedor é obrigatório"),
    body("email")
        .isEmail().withMessage("O email do fornecedor é inválido"),
    body("representante")
        .notEmpty().withMessage("O representante do fornecedor é obrigatório")
]