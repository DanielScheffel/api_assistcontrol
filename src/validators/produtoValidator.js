import { body } from "express-validator";

export const produtoValidator = [
    body("nome")
        .notEmpty().withMessage("O nome do produto é obrigatório"),

    body("sku")
        .notEmpty().withMessage("O SKU do produto é obrigatório")
        .isAlphanumeric().withMessage("O SKU deve conter apenas caracteres alfanuméricos"),

    body("valor_produto")
        .notEmpty().withMessage("O valor do produto é obrigatório")
        .isFloat({ gt: 0 }).withMessage("O valor do produto deve ser um número maior que zero"),

    body("cor")
        .notEmpty().withMessage("A cor do produto é obrigatória"),

    body("id_categoria")
        .notEmpty().withMessage("O ID da categoria é obrigatório")
        .isInt({ gt: 0 }).withMessage("O ID da categoria deve ser um número inteiro maior que zero"),

    body("id_fornecedor")
        .notEmpty().withMessage("O ID do fornecedor é obrigatório")
        .isInt({ gt: 0 }).withMessage("O ID do fornecedor deve ser um número inteiro maior que zero")
]