const { User } = require('../Models/useModel');
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

            // Log do token para depuração
            console.log("Token recebido:", token);

            // Verificar se o token tem o formato correto
            if (token.split('.').length !== 3) {
                return res.status(400).json({ errors: ["Token malformado."] });
            }

            // Verificar o token usando a chave secreta
            const verified = jwt.verify(token, process.env.JWT_SECRET);

            console.log(verified)
            // Adicionar informações do usuário autenticado à requisição (req)
            req.user = await User.findById(verified.id).select("-password");

            if(req.user.tokenActive != token || req.user.tokenIsNotValide.includes(token)){
                return res.status(403).json({ errors: ["Permissão inválida."] });
            }

            
            if (!req.user) {
                return res.status(404).json({ errors: ["Usuário não encontrado."] });
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
