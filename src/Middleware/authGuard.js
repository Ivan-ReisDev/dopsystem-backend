const { User } = require('../Models/userModel'); // Corrigido: caminho do modelo de usuário
const jwt = require("jsonwebtoken");

// Middleware de autorização
const authGuard = (requiredRoles) => {
    return async (req, res, next) => {
        try {
            // Obter o token do cookie HttpOnly
            const token = req.cookies.token;
            if (!token) {
                return res.status(401).json({ errors: ["Acesso negado!"] });
            }

            // Verificar o token usando a chave secreta
            const verified = jwt.verify(token, process.env.JWT_SECRET);

            // Adicionar informações do usuário autenticado à requisição (req)
            req.user = await User.findById(verified.id).select("-password");

            // Verificar se o token é válido para o usuário
            if (!req.user || req.user.tokenActive !== token || req.user.tokenIsNotValid.includes(token)) {
                return res.status(403).json({ errors: ["Permissão inválida."] });
            }

            // Verificar se o usuário tem uma das permissões necessárias
            if (!requiredRoles.includes(req.user.userType)) {
                return res.status(403).json({ errors: ["Permissão insuficiente."] });
            }

            // Chamar o próximo middleware
            next();
        } catch (err) {
            console.error(err);
            // Responder com erro em caso de token inválido ou qualquer outro erro
            res.status(401).json({ errors: ["Token inválido."] });
        }
    }
};

module.exports = authGuard;
