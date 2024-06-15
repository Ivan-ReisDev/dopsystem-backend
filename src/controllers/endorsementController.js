const { Logger } = require('../Models/logsModel');
const { User } = require('../Models/useModel');
const { Endorsement } = require('../Models/endorsementModel');
const moment = require('moment');

const createLogger = async (action, user, name, ip) => {
  const newLogger = {
      user: user,
      ip: ip,
      loggerType: `${action} ${name}`
  }

  await Logger.create(newLogger);
}

const serviceControllerEndorsement = {
  //Função para aprovar ou reprovar requerimentos:
  createAval: async (req, res) => {
    try {
      const { idUser, nicknameAval, initialDate, reason, endorsementdays } = req.body;
      const nicknameOperator = await User.findOne({ _id: idUser });
      const nickname = await User.findOne({ nickname: nicknameAval });
      if (!nickname || !nicknameOperator) {
        return res.status(404).json({ error: 'Usuário não encontrado com o nickname fornecido.' });
      }
  
      const startDate = moment(initialDate, 'YYYY-MM-DD');
      const endDate = startDate.clone().add(endorsementdays, 'days');
  
      const formattedStartDate = startDate.format('DD/MM/YYYY');
      const formattedEndDate = endDate.format('DD/MM/YYYY');

      const newEndorsement = {
        nicknameAval: nickname.nickname,
        reason: reason,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        endorsementdays,
        status: "Pendente"
      };

      const sucesso = await Endorsement.create(newEndorsement);
      if (sucesso) {
        return res.status(200).json({ msg: "Aval criado com sucesso." });
      }

      // Aqui pode ser o problema, pois você está tentando enviar duas respostas
      // Dependendo de como está configurado o seu model Endorsement, sucesso pode não ser uma condição confiável

      return res.status(500).json({ error: "Erro desconhecido." }); 
    } catch (error) {
      console.error('Não foi possível criar a avaliação.', error);
      return res.status(500).json({ msg: 'Não foi possível criar a avaliação.' });
    }
  },

  editAval: async (req, res) => {
    try {
      const { idUser, idAval, statusAval } = req.body;
      const nicknameOperator = await User.findOne({ _id: idUser });
      const aval = await Endorsement.findOne({_id: idAval})

      if (!nicknameOperator) {
        res.status(404).json({ msg: 'Ops! Usuário não encontrado.' });
      } 
      
      if(!aval) {
        res.status(404).json({ msg: 'Ops! Aval não encontrado.' });
      } 
      
        if (nicknameOperator && (nicknameOperator.userType === "Admin" || nicknameOperator.userType === "Recursos Humanos" || nicknameOperator.userType === "Diretor")) {
          aval.nicknameAval = aval.nicknameAval;
          aval.startDate = aval.startDate;
          aval.endorsementdays = aval.endorsementdays;
          aval.endDate = aval.endDate;
          aval.reason = aval.reason;
          aval.status = statusAval === "Aprovado" ? statusAval : "Reprovado";
          await aval.save();
          return res.status(200).json({ msg: `Aval ${statusAval} com sucesso.` });
      }

      return res.status(404).json({ msg: 'Ops! Parece que você não tem permissão para editar esse documento.' });

    } catch (error) {
      console.error('Não foi possível atualizar o aval.', error);
      res.status(500).json({ error: 'Não foi possível atualizar o aval.' })
    }

  },

  deleteAval: async (req, res) => {
    try {
      const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      const { idUser, idAval } = req.body;
      const admin = await User.findOne({ _id: idUser });
      const aval = await Endorsement.findOne({ _id: idAval })
      if (!aval) {
        return res.status(404).json({ error: 'Aval não encontrado' });
      }

      if (admin && (admin.userType === "Admin" || admin.userType === "Diretor" )){
        await Endorsement.findByIdAndDelete(idAval);
        return res.status(200).json({ msg: 'Aval deletado com sucesso' });
      }

      await createLogger("Acabou de deletar um", admin.nickname, "Aval", ipAddress)
      return res.status(404).json({ error: 'Ops! Você não tem permissão para excluir esse Aval.' })

    } catch (error) {
      console.error('Não foi possível deletar o aval', error);
      res.status(500).json({ error: 'Não foi possível deletar a publicação' })
    }

  },

  getAval: async (req, res) => {
    try {
      // Busca todos os registros de Endorsement do banco de dados, ordenando por data de forma decrescente
      const avais = await Endorsement.find().sort({ createdAt: -1 });
  
      // Retorna os dados ordenados por data decrescente
      return res.json(avais);
  
    } catch (error) {
      // Trata erros de forma apropriada
      console.error('Erro ao obter avaliações', error);
      res.status(500).json({ error: 'Erro ao obter avaliações' });
    }
  }
  
  

};

module.exports = serviceControllerEndorsement;
