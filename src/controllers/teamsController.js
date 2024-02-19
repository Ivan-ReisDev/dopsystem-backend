const { Teams } = require("../Models/teamsModel");
const { User } = require("../Models/useModel");

const serviceControllerTeams = {
    createTeams: async (req, res) => {
        try {
            const { idUser, nameTeams, teamsType, leader, viceLeader, members, classes } = req.body;
            const nameTeam = await Teams.findOne({ nameTeams: nameTeams });
            const nickname = await User.findOne({ idUser: idUser });

            if (nickname && nickname.userType !== "Admin") {
                return res.status(422).json({ error: 'Ops! Você não é um administrador.' })
            }

            if (nameTeam) {
                return res.status(422).json({ error: 'Ops! Essa equipe já existe.' })
            }

            if (!nameTeams || !teamsType || !leader || !leader || !viceLeader || !members || !classes) {
                return res.status(422).json({ error: 'Preencha todos os campos' })
            }

            const newTeams = {
                nameTeams: nameTeams,
                teamsType: teamsType,
                leader: leader,
                viceLeader: viceLeader,
                members: members,
                classes: classes
            }

            const createTeams = await Teams.create(newTeams)

            if (!createTeams) {
                return res.status(422).json({ error: 'Ops! Parece que houve um erro, tente novamente mais tarde.' })
            }

            res.status(201).json({ msg: 'Equipe criada com sucesso.' })

        } catch (error) {
            console.error('Erro ao registrar', error);
            res.status(500).json({ msg: 'Erro ao cadastrar equipe.' })
        }
    },

    deleteTeams: async (req, res) => {
        try {
            const teamsId = req.params.teamsId;
            const { nick } = req.body;
            const admin = await User.findOne({ nickname: nick });
            const deleteTeam = await Teams.findById(teamsId)

            if (!deleteTeam) {
                return res.status(404).json({ msg: 'Ops! Equipe ou órgão não encontrado' });
            }
            if (admin && admin.userType !== "Admin") {
                return res.status(404).json({ msg: 'Ops! Parece que você não é uma administrador.' });
            }

            if (admin && admin.userType === "Admin" && deleteTeam) {
                await Teams.findByIdAndDelete(teamsId);
                return res.status(200).json({ msg: 'Usuário deletedo com sucesso' });
            }

        } catch (error) {
            console.error('Não foi possível deletar o usuário', error);
            res.status(500).json({ msg: 'Não foi possível deletar o usuário' })
        }
    },

};

module.exports = serviceControllerTeams;
