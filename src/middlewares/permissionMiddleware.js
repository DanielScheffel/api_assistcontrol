

export function permissionTypes(...tiposPermitido) {
    return (req, res, next) => {
        const usuario = req.user;

        if(!usuario) {
            return res.status(401).json({
                message: "Usuário não autenticado",
            })
        }

        if(!tiposPermitido.includes(usuario.tipo_usuario)) {
            return res.status(403).json({
                message: "Você não tem permissão para acessar este recurso",
            });
        }

        next();
    }
}