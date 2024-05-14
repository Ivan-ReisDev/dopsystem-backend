const { Teams } = require("../Models/teamsModel");
const { User } = require("../Models/useModel");
const { InfoSystem } = require("../Models/systemModel");

const serviceControllerSystem = {

    createInfo: async (req, res) => {
        try {
            const { idUser, name, patents, paidPositions, teams } = req.body;
            const nickname = await User.findOne({ idUser: idUser });

            if (nickname && nickname.userType !== "Admin") {
                return res.status(422).json({ error: 'Ops! Você não é um administrador.' })
            }

            if (!name || !patents || !paidPositions || !teams) {
                return res.status(422).json({ error: 'Preencha todos os campos' })
            }

            const newInfo = {
                name,
                patents,
                paidPositions,
                teams,
            }

            const createInfo = await InfoSystem.create(newInfo)

            if (!createInfo) {
                return res.status(422).json({ error: 'Ops! Parece que houve um erro, tente novamente mais tarde.' })
            }

            res.status(201).json({ msg: 'Equipe criada com sucesso.' })

        } catch (error) {
            console.error('Erro ao registrar', error);
            res.status(500).json({ msg: 'Erro ao cadastrar equipe.' })
        }
    },

    getInfoSystem: async (req, res) => {
        try {
          const systemInfo = await InfoSystem.find();
          return res.json(systemInfo)
        } catch (error) {
    
          console.error('Informações não encontradas', error);
          res.status(500).json({ msg: 'Informações não encontradas' })
        }
      },
    
};

module.exports = serviceControllerSystem;
