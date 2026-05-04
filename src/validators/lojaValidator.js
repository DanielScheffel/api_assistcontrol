import { body } from "express-validator";

export const lojaValidator = [
    body("loja_nome")
        .notEmpty().withMessage("O nome da loja é obrigatório"),

    body("cidade")
        .notEmpty().withMessage("A cidade da loja é obrigatória"),

    body("uf")
        .notEmpty().withMessage("A UF da loja é obrigatória")
        .isLength({ min: 2, max: 2 }).withMessage("A UF deve conter exatamente 2 caracteres"),

    body("sigla")
        .notEmpty().withMessage("A sigla da loja é obrigatória")
        .isLength({ min: 3, max: 3 }).withMessage("A sigla deve conter exatamente 3 caracteres"),

    body("cnpj")
        .notEmpty().withMessage("O CNPJ da loja é obrigatório")
        .matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/).withMessage("O CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX")
]