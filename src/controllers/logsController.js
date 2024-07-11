const { Logger } = require('../Models/logsModel');
const { User } = require('../Models/useModel');


const serviceControllerLogger = {
    //Função responsável por criar a equioe
    getAllLogs: async (req, res) => {
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
    },

    // deleteLogs: async (req, res) => {
    //   try {
    //     await Logger.deleteMany();
    //     return res.status(200).json({ msg: "Deletado com sucesso" });
    //   } catch (error) {
    //     console.error("Erro ao deletar logs:", error);
    //     return res.status(500).json({ msg: "Erro ao deletar logs" });
    //   }
    // },
    
};

module.exports = serviceControllerLogger;
