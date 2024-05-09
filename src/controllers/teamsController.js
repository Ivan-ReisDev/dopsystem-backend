const { Teams } = require("../Models/teamsModel");
const { User } = require("../Models/useModel");

const serviceControllerTeams = {
    //Função responsável por criar a equioe
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
                nameTeams: nameTeams.toLowerCase(0),
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
    //Função Responsável por mostrar todas as equipes ou filtrar as equipes de acordo com a query
    searchTeams: async (req, res) => {
        try {
            const  nameTeams  = req.query.nameTeams;
            console.log(nameTeams)
            const teams = await Teams.find().sort({ nameTeams: 1 });
            const resTeams = nameTeams
                ? teams.filter(team => team.nameTeams.includes(nameTeams)) 
                : teams;
            return res.json(resTeams);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    },

    //Função para atualizar a equipe
    updateTeams: async (req, res) => {
        try {
            const teamsId = req.params.teamsId;
            const { idUser, nameTeams, leader, viceLeader, members, classes } = req.body;
            const userAdmin = await User.findById(idUser)
            const teamsUpdate = await Teams.findById(teamsId);

            if (!teamsUpdate) {
                return res.status(404).json({ msg: 'Ops! Equipe não encontrada.' });
            }

            if (userAdmin  && userAdmin.userType !== 'Admin') {
                return res.status(404).json({ msg: 'Ops! Parece que você não é uma administrador.' });
            }

            teamsUpdate.nameTeams = nameTeams !== ""? nameTeams : teamsUpdate.nameTeams;
            teamsUpdate.teamsType = teamsUpdate.teamsType;
            teamsUpdate.leader = leader !== "" ? leader : teamsUpdate.leader;
            teamsUpdate.viceLeader = viceLeader !== "" ? viceLeader : teamsUpdate.viceLeader;
            teamsUpdate.members = members !== ""? [...teamsUpdate.members, members] : teamsUpdate.members;
            teamsUpdate.classes = classes !== ""? [...teamsUpdate.classes, classes ] : teamsUpdate.classes;
            
            await teamsUpdate.save()
            res.status(200).json({ msg: 'Equipe atualizada com sucesso!' });

        } catch (error) {
            console.error('Ops! Não foi possível atualizar a equipe ou órgão.', error);
            res.status(500).json({ msg: 'Ops! Não foi possível atualizar a equipe ou órgão.' })
        }

    },

    //Função responsável por deletar uma equipe de acordo com o id params dela.
    deleteTeams: async (req, res) => {
        try {
            const teamsId = req.params.teamsId;
            const { nick } = req.body;
            const admin = await User.findOne({ nickname: nick })
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
