import { validationResult } from "express-validator";

export function validationMiddleware(req, res, next) {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({
            message: "Erro de validação",
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        })
    }

    return next();
}