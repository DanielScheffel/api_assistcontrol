import { body } from "express-validator";

export const assistenciaValidator = [
    body("defeito")
        .notEmpty().withMessage("O campo defeito é obrigatório")
        .isString().withMessage("O campo defeito deve ser uma string"),

    body("numero_peca")
        .notEmpty().withMessage("O campo número da peça é obrigatório")
        .isString().withMessage("O campo número da peça deve ser uma string"),

    body("descricao_peca")
        .notEmpty().withMessage("O campo descrição da peça é obrigatório")
        .isString().withMessage("O campo descrição da peça deve ser uma string"),
    
    body("loja_id")
        .notEmpty().withMessage("O campo loja_id é obrigatório")
        .isInt().withMessage("O campo loja_id deve ser um número inteiro"),

    body("produto_id")
        .notEmpty().withMessage("O campo produto_id é obrigatório")
        .isInt().withMessage("O campo produto_id deve ser um número inteiro"),

    body("status_assistencia_id")
        .notEmpty().withMessage("O campo status_assistencia_id é obrigatório")
        .isInt().withMessage("O campo status_assistencia_id deve ser um número inteiro"),
]