const { User } = require('../Models/useModel');
const jwt = require("jsonwebtoken")

// Middleware de autorização
const authGuard = async (req, res, next) => {

    // Obter o token do cabeçalho de autorização
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    // Verificar se há um token no cabeçalho
    if (!token) {
        return res.status(401).json({ errors: ["Acesso negado!"] });
    }

    // Verificar se o token é válido
    try {
        // Verificar o token usando a chave secreta
        const verified = jwt.verify(token, 'KS1486735ANFSAN36454BFGSAF45471PKPEKGPSAGK1454EDGG');

        // Adicionar informações do usuário autenticado à requisição (req)
        req.user = await User.findById(verified.id).select("-password");
        // Chamar o próximo middleware
        next();
    } catch (err) {
        // Responder com erro em caso de token inválido
        res.status(400).json({ errors: ["Token inválido."] });
    }
}

module.exports = authGuard;