const { Logger } = require('../Models/logsModel');
const { User } = require('../Models/useModel');
const { Requirements } = require("../Models/RequirementsModel");

const serviceControllerRh = {
        //Função para aprovar ou reprovar requerimentos:
        editRequeriment: async (req, res) => {
        try {
          const { idUser, idRequirements, statusRequirements}  = req.body;
          const nicknameOperator = await User.findOne({ _id: idUser });
          const requirement = await Requirements.findById(idRequirements);
          const nickname = await User.findOne({ nickname: requirement.promoted });

          if (!nickname || !nicknameOperator) {
            res.status(404).json({ msg: 'Ops! Usuário não encontrado.' });
          } 

            nickname.nickname = nickname.nickname;
            nickname.patent = statusRequirements === "Aprovado" ? requirement.newPatent : nickname.patent;
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
            res.status(200).json({ msg: `Requerimento ${statusRequirements} com sucesso.` });
    
    
        } catch (error) {
          console.error('Não foi possível atualizar o requerimento.', error);
          res.status(500).json({ msg: 'Não foi possível atualizar o requerimento' })
        }

        },
    
};

module.exports = serviceControllerRh;
