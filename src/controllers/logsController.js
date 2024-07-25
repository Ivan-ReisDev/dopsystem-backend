import { Logger } from '../Models/logsModel.js';
import { User } from '../Models/useModel.js';

export default class ServiceControllerLogger{
    //Função responsável por criar a equioe
    async getAllLogs(req, res){
      try {
        const $nickname = req.query.nickname;
        const page = parseInt(req.query.page) || 1; // Número da página
        const limit = parseInt(req.query.limit) || 10; // Tamanho da página (itens por página)
        const search = req.query.search;
        console.log("search AQUI -> " + search)
        const admin = await User.findOne({ nickname: $nickname });
        let logs;
        let totalLogs;
    
        if (!admin || admin.userType !== "Admin") {
          return res.status(404).json({ msg: 'Ops! Parece que você não é um administrador.' });
        }
    
        // Calcule o número de documentos a pular
        const skip = Math.max(0, (page - 1) * limit);
    
        // Encontre os logs com paginação, começando do último e em ordem decrescente
        if (search !== undefined && search !== "") {
          logs = await Logger.find({ user: search }).sort({ createdAt: -1 }).skip(skip).limit(limit);
          totalLogs = await Logger.countDocuments({ user: search });
        } else {
          logs = await Logger.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
          totalLogs = await Logger.countDocuments();
        }
    
        return res.json({
          logs,
          currentPage: page,
          totalPages: Math.ceil(totalLogs / limit),
          totalLogs
        });
    
      } catch (error) {
        console.error('Erro ao buscar logs', error);
        res.status(500).json({ msg: 'Erro ao buscar logs' });
      }
    };
};
