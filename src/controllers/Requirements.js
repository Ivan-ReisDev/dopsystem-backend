const { Teams } = require("../Models/teamsModel");
const { User } = require("../Models/useModel");
const { Requirements } = require("../Models/RequirementsModel");
const { InfoSystem } = require("../Models/systemModel");

const serviceControllerRequirements = {
     //Função responsável por criar a equioe
     createRequirements: async (req, res) => {
        try {
            const { idUser, promoted, reason } = req.body;
            const nicknameOperator = await User.findOne({ idUser: idUser });
            const nicknamePromoted = await User.findOne({ nickname: promoted });
            const info = await InfoSystem.findOne(); 
    
            if (!info || !info.patents) {
                return res.status(500).json({ msg: 'Informações do sistema não encontradas.' });
            }
    
            const patentOperadorIndex = info.patents.includes(nicknameOperator.patent) ? 
            info.patents.indexOf(nicknameOperator.patent) : 
            info.paidPositions.indexOf(nicknameOperator.patent);

            const patentPromotedIndex = info.patents.includes(nicknamePromoted.patent) ? 
            info.patents.indexOf(nicknamePromoted.patent) :
            info.paidPositions.indexOf(nicknamePromoted.patent);


            const indexRealOperator =  patentOperadorIndex - 2;
            if (patentPromotedIndex >= indexRealOperator) {
                return res.status(422).json({ error: 'Ops! Você não tem permissão para promover esse usuário' });
            }
    
            const newIndexPatent = patentPromotedIndex + 1;
            const newPatent = info.patents[newIndexPatent];
            const newRequirement = {
                promoted,
                newPatent,
                reason,
                operator: nicknameOperator.nickname,
                typeRequirement: "Promoção",
                status: "Pendente"
            };
    
            const createRequirement = await Requirements.create(newRequirement);
    
            if (!createRequirement) {
                return res.status(422).json({ error: 'Ops! Parece que houve um erro, tente novamente mais tarde.' });
            }
    
            res.status(201).json({ msg: 'Requerimento postado com sucesso.' });
    
        } catch (error) {
            console.error('Erro ao postar requerimento.', error);
            res.status(500).json({ msg: 'Erro ao postar requerimento.' });
        }
    },

    createRequirementsRelegation: async (req, res) => {
        try {
            const { idUser, promoted, reason } = req.body;
            const nicknameOperator = await User.findOne({ idUser: idUser });
            const nicknameRelegation = await User.findOne({ nickname: promoted });
            const info = await InfoSystem.findOne(); 
    
            if (!info || !info.patents || !info.paidPositions) {
                return res.status(500).json({ msg: 'Informações do sistema não encontradas.'});
            }
    
            const patentOperadorIndex = info.patents.includes(nicknameOperator.patent) ?
            info.patents.indexOf(nicknameOperator.patent) : 
            info.paidPositions.indexOf(nicknameOperator.patent);

            const patentRelegationIndex = info.patents.includes(nicknameRelegation.patent) ? 
            info.patents.indexOf(nicknameRelegation.patent) :
            info.paidPositions.indexOf(nicknameRelegation.patent);

            const indexRealOperator =  patentOperadorIndex - 2;

            if (patentRelegationIndex >= indexRealOperator) {
                return res.status(422).json({ error: 'Ops! Você não tem permissão para rebaixar esse usuário reporte o caso para algum superior' });
            }
    
            const newIndexPatent = patentRelegationIndex - 1;
            const newPatent = info.patents[newIndexPatent];

            const newRequirement = {
                promoted,
                newPatent,
                reason,
                operator: nicknameOperator.nickname,
                typeRequirement: "Rebaixamento",
                status: "Pendente"
            };
    
            const createRequirement = await Requirements.create(newRequirement);
    
            if (!createRequirement) {
                return res.status(422).json({ error: 'Ops! Parece que houve um erro, tente novamente mais tarde.' });
            }
    
            res.status(201).json({ msg: 'Requerimento postado com sucesso.' });
    
        } catch (error) {
            console.error('Erro ao postar requerimento.', error);
            res.status(500).json({ msg: 'Erro ao postar requerimento.' });
        }
    },

    getAllRequirements: async (req, res) => {
        try {
          const Requirement = await Requirements.find();
          res.json(teams)
        } catch (error) {
    
          console.error('Usuário não encontrado', error);
          res.status(500).json({ msg: 'Usuário não encontrado' })
        }
      },
      
      searchRequeriments: async (req, res) => {
        try {
            const  nameRequeriment  = req.query.promoted;
            const Requirement = await Requirements.find({promoted: nameRequeriment});
            res.json(Requirement)
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    },

};

module.exports = serviceControllerRequirements;
