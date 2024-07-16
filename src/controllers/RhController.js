const { Logger } = require('../Models/logsModel');
const { User } = require('../Models/useModel');
const { Requirements } = require("../Models/RequirementsModel");
const { Teams } = require('../Models/teamsModel');

const serviceControllerRh = {
  //Função para aprovar ou reprovar requerimentos:
  editRequeriment: async (req, res) => {
    try {
      const { idUser, idRequirements, statusRequirements } = req.body;
      const nicknameOperator = await User.findOne({ _id: idUser });
      const requirement = await Requirements.findById(idRequirements);
      const nickname = await User.findOne({ nickname: requirement.promoted });

      if (!nickname || !nicknameOperator) {
        res.status(404).json({ msg: 'Ops! Usuário não encontrado.' });
      }

      if (nicknameOperator && (nicknameOperator.userType === "Admin" || nicknameOperator.userType === "Recursos Humanos" || nicknameOperator.userType === "Diretor" || team.leader === nicknameOperator.nickname || membersTeam === true)) {
        nickname.nickname = nickname.nickname;
        nickname.patent = statusRequirements === "Aprovado" ? requirement.newPatent : nickname.patent;
        nickname.code =  requirement.newMotto ?? nickname.code
        nickname.classes = nickname.classes;
        nickname.teans = nickname.teans;
        nickname.status = nickname.status;
        nickname.tag = nickname.tag;
        nickname.warnings = requirement.typeRequirement === "Advertência" ? nickname.warnings = 1 : nickname.warnings;
        nickname.medals = nickname.medals;
        nickname.password = nickname.password;
        nickname.userType = nickname.userType;

        requirement.promoted
        requirement.newPatent
        requirement.patentOperador
        requirement.operator
        requirement.reason
        requirement.typeRequirement
        requirement.status = statusRequirements
        await nickname.save();
        await requirement.save();
        return res.status(200).json({ msg: `Requerimento ${statusRequirements} com sucesso.` });

      }

     return res.status(404).json({ msg: 'Ops! Parece que você não tem permissão para editar esse documento.' });

    } catch (error) {
      console.error('Não foi possível atualizar o requerimento.', error);
      res.status(500).json({ msg: 'Não foi possível atualizar o requerimento' })
    }

  },

  deleteRequeriments: async (req, res) => {
    try {
      const { idUser, idRequirements } = req.body;
      const admin = await User.findOne({ _id: idUser });
      const deleteRequeriment = await Requirements.findOne({ _id: idRequirements })

      if (!deleteRequeriment) {
        return res.status(404).json({ error: 'Requerimento não encontrado não encontrado' });
      }

      if (admin && (admin.userType === "Admin" || admin.userType === "Diretor" || admin.userType === "Recursos Humanos") ) {
        await Requirements.findByIdAndDelete(idRequirements);
        return res.status(200).json({ msg: 'Requerimento deletedo com sucesso' });
      }

      return res.status(404).json({ error: 'Ops! Você não tem permissão para excluir esse requerimento.' })

    } catch (error) {
      console.error('Não foi possível deletar o requerimento', error);
      res.status(500).json({ error: 'Não foi possível deletar o requerimento' })
    }

  },


};

module.exports = serviceControllerRh;
