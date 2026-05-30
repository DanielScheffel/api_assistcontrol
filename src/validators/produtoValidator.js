import { body } from "express-validator";

export const produtoValidator = [

    body("sku")
        .notEmpty().withMessage("O SKU do produto é obrigatório")
        .isAlphanumeric().withMessage("O SKU deve conter apenas caracteres alfanuméricos"),

    body("descricao")
        .notEmpty().withMessage("A descrição do produto é obrigatória"),

    body("valor_produto")
        .notEmpty().withMessage("O valor do produto é obrigatório")
        .isFloat({ gt: 0 }).withMessage("O valor do produto deve ser um número maior que zero"),

    body("codigo_gtin_ean")
        .notEmpty().withMessage("O código GTIN/EAN do produto é obrigatório")
        .isNumeric().withMessage("O código GTIN/EAN deve conter apenas números")
        .isLength({ min: 8, max: 14 }).withMessage("O código GTIN/EAN deve conter entre 8 e 14 dígitos"),

    body("categoria_id")
        .notEmpty().withMessage("O ID da categoria é obrigatório")
        .isInt({ gt: 0 }).withMessage("O ID da categoria deve ser um número inteiro maior que zero"),

    body("fornecedor_id")
        .notEmpty().withMessage("O ID do fornecedor é obrigatório")
        .isInt({ gt: 0 }).withMessage("O ID do fornecedor deve ser um número inteiro maior que zero")
]