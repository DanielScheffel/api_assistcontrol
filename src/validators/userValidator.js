import { body } from "express-validator";

export const cadastroUsuarioValidator = [

    body("nome")
        .notEmpty().withMessage("O nome é obrigatório"),
    
    body("email")
        .notEmpty().withMessage("O email é obrigatório")
        .isEmail().withMessage("Email inválido"),

    body("senha")
        .notEmpty().withMessage("A senha é obrigatória")
        .isLength({ min: 12 }).withMessage("A senha deve conter no mínimo 12 caracteres"),

    body("tipo_usuario")
        .notEmpty().withMessage("O tipo de usuário é obrigatório")
        .isIn(['Administrador', 'Gerente', 'Funcionario']).withMessage("Tipo de usuário inválido")

]