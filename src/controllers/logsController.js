const { Logger } = require('../Models/logsModel');
const { User } = require('../Models/useModel');


const serviceControllerLogger = {
    //Função responsável por criar a equioe
    getAllLogs: async (req, res) => {
        try {
          const $nickname =  req.query.nickname
          const admin = await User.findOne({ nickname: $nickname });
          const logs = await Logger.find();
        
          if(!admin || admin.userType !== "Admin") {
            return res.status(404).json({ msg: 'Ops! Parece que você não é um administrador.' });
          }
          
          return res.json(logs);

        } catch (error) {
    
          console.error('Documento não encontrado', error);
          res.status(500).json({ msg: 'Documento não encontrado' })
        }
      }


};

module.exports = serviceControllerLogger;
