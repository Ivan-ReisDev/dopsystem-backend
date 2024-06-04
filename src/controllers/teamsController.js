const { Teams } = require("../Models/teamsModel");
const { User } = require("../Models/useModel");
const { Logger } = require('../Models/logsModel');
const { Requirements } = require("../Models/RequirementsModel");
const mongoose = require('mongoose');


function dataSeisDiasAtras() {
    const hoje = new Date();
    hoje.setDate(hoje.getDate() - 7);
    // Retorna a data formatada como string (opcional)
    // Aqui, você pode escolher o formato desejado. Este exemplo retorna a data no formato ISO (YYYY-MM-DD)
    const dataFormatada = hoje.toISOString().split()[0];
    return dataFormatada;
}

const createLogger = async (action, user, name, ip) => {
    const newLogger = {
        user: user,
        ip: ip,
        loggerType: `${action} ${name}`
    }

    await Logger.create(newLogger);

}

const updateProfile = async (nickname, team) => {
    const userMember = await User.findOne({ nickname: nickname });
    
    if (!userMember) {
        console.error(`User with nickname ${nickname} not found.`);
        return; // Ou lançar um erro, dependendo de como você quer lidar com isso
    }

    console.log(userMember);

    let newTeams = userMember.teams || []; // Corrigir a propriedade de teans para teams
    newTeams.push(team);

    userMember.teams = newTeams;

    // Não é necessário redefinir todas as outras propriedades se não estiverem sendo alteradas
    await userMember.save();
}

const serviceControllerTeams = {

    returnInfoTeams: async (req, res) => {
        try {
            const typeRequirement = req.query.typeRequirement;
            const nameTeams = req.query.teams;
            const hoje = new Date();
            const seisDiasAtras = new Date(dataSeisDiasAtras());

            const requeriments = await Requirements.find({
                createdAt: {
                    $gte: seisDiasAtras,
                    $lte: hoje
                }
            });

            let newArrayRequirements;
            if (typeRequirement) {
                newArrayRequirements = requeriments.filter(objeto => objeto.team === typeRequirement);
                const teams = await Teams.find({ nameTeams: nameTeams });
                const newResponse = teams[0].members.map(user => {
                    const filteredRequirements = newArrayRequirements.filter(requirement => requirement.operator === user.nickname);

                    return {
                        user: user,
                        requirements: filteredRequirements
                    };
                });

                return res.json(newResponse);
            }

            return res.json(requeriments);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },


    RemoveUserTeams: async (req, res) => {
        try {
            const { idUser, nickMember, idTeams } = req.body;

            // Validação do ID do documento
            if (!mongoose.Types.ObjectId.isValid(idTeams)) {
                return res.status(400).json({ msg: 'ID do usuário inválido.' });
            }
            const userAdmin = await User.findById(idUser);
            const userMember = await User.findOne({ nickname: nickMember });


            if (!userMember) {

                return res.status(404).json({ msg: 'Ops! Usuário não encontrado.' });
            }

            if (!userAdmin) {

                return res.status(404).json({ msg: 'Ops! Usuário não encontrado.' });
            }

            const teamUpdate = await Teams.findById(idTeams);


            if (userAdmin && userAdmin.userType === 'Admin' || userAdmin.userType === 'Diretor' || teamUpdate.leader === userAdmin.nickname || teamUpdate.viceLeader === userAdmin.nickname) {
                const newArray = teamUpdate.members.filter(user => user.nickname !== userMember.nickname);

                teamUpdate.nameTeams = teamUpdate.nameTeams;
                teamUpdate.teamsType = teamUpdate.teamsType;
                teamUpdate.leader = teamUpdate.leader;
                teamUpdate.viceLeader = teamUpdate.viceLeader;
                teamUpdate.members = newArray;
                teamUpdate.classes = teamUpdate.classes;

                const newArrayMember = userMember.teans.filter(team => team !== teamUpdate.nameTeams);

                userMember.nickname = userMember.nickname;
                userMember.patent = userMember.patent;
                userMember.classes = userMember.classes;
                userMember.teans = newArrayMember;
                userMember.status = userMember.status;
                userMember.tag = userMember.tag ? userMember.tag : "vázio";
                userMember.warnings = userMember.warnings ? userMember.warnings : "0";
                userMember.medals = userMember.medals ? userMember.medals : "0"
                userMember.password = userMember.password;
                userMember.userType = userMember.userType;

                await userMember.save();
                await teamUpdate.save();

                return res.status(200).json({ msg: 'Usuário removido com sucesso.' });

            }

            return res.status(403).json({ msg: 'Ops! Parece que você não é um administrador.' });



        } catch (error) {
            console.error('Ops! Não foi possível atualizar o documento.', error);
            res.status(500).json({ msg: 'Ops! Não foi possível atualizar o documento.' });
        }
    },

    addUserTeams: async (req, res) => {
        try {

            const { idUser, nickMember, office, idTeams } = req.body;

            // Validação do ID do documento
            if (!mongoose.Types.ObjectId.isValid(idTeams)) {
                return res.status(400).json({ error: 'ID do usuário inválido.' });
            }
            const userAdmin = await User.findById(idUser);
            const userMember = await User.findOne({ nickname: nickMember });


            if (!userMember) {

                return res.status(404).json({ error: 'Ops! Usuário não encontrado.' });
            }

            if (!userAdmin) {

                return res.status(404).json({ error: 'Ops! Usuário não encontrado.' });
            }

            const teamUpdate = await Teams.findById(idTeams);


            if (userAdmin && userAdmin.userType === 'Admin' || userAdmin.userType === 'Diretor' || teamUpdate.leader === userAdmin.nickname || teamUpdate.viceLeader === userAdmin.nickname) {

                const newMember = {
                    nickname: userMember.nickname,
                    office,
                }

                let newMemberArray = teamUpdate.members;
                newMemberArray.push(newMember);

                teamUpdate.nameTeams = teamUpdate.nameTeams;
                teamUpdate.teamsType = teamUpdate.teamsType;
                teamUpdate.leader = teamUpdate.leader;
                teamUpdate.viceLeader = teamUpdate.viceLeader;
                teamUpdate.members = newMemberArray;
                teamUpdate.classes = teamUpdate.classes;

                const newAtt = teamUpdate.nameTeams
                let newArrayAtt = userMember.teans;
                newArrayAtt.push(newAtt);

                userMember.nickname = userMember.nickname;
                userMember.patent = userMember.patent;
                userMember.classes = userMember.classes;
                userMember.teans = newArrayAtt;
                userMember.status = userMember.status;
                userMember.tag = userMember.tag;
                userMember.warnings = userMember.warnings;
                userMember.medals = userMember.medals;
                userMember.password = userMember.password;
                userMember.userType = userMember.userType;

                await userMember.save();
                await teamUpdate.save();

                return res.status(200).json({ msg: 'Usuário adicionado com sucesso.' });

            }

            return res.status(403).json({ msg: 'Ops! Parece que você não é um administrador.' });



        } catch (error) {
            console.error('Ops! Não foi possível atualizar o documento.', error);
            res.status(500).json({ msg: 'Ops! Não foi possível atualizar o documento.' });
        }
    },


    createTeams: async (req, res) => {
        try {
            const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            console.log(req.body);
            const { idUser, nameTeams, leader, viceLeader } = req.body;

            if (!nameTeams || !leader || !viceLeader) {
                return res.status(422).json({ error: 'Preencha todos os campos' })
            }

            const nickname = await User.findOne({ _id: idUser });
            if (nickname && nickname.userType !== "Admin") {
                return res.status(422).json({ error: 'Ops! Você não é um administrador.' })
            }

            const nicknameLeader = await User.findOne({ nickname: leader });
            if (!nicknameLeader) {
                return res.status(422).json({ error: 'Ops! Esse líder não existe em nossos sistemas.' })
            }

            const nicknameViceLeader = await User.findOne({ nickname: viceLeader });
            if (!nicknameViceLeader) {
                return res.status(422).json({ error: 'Ops! Esse vice-líder não existe em nossos sistemas.' })
            }

            const nameTeam = await Teams.findOne({ nameTeams: nameTeams });
            if (nameTeam) {
                return res.status(422).json({ error: 'Ops! Essa equipe já existe.' })
            }

            const membersLeader = {
                nickname: leader,
                office: "Líder"
            }

            const membersViceLeader = {
                nickname: viceLeader,
                office: "Vice Líder"
            }
            
            await updateProfile(nicknameLeader.nickname, nameTeams);
            await updateProfile(viceLeader, nameTeams);

            const newTeams = {
                nameTeams: nameTeams,
                leader: leader,
                viceLeader: viceLeader,
                members: [membersLeader, membersViceLeader] ,
            }

            const newLogger = {
                user: nickname.nickname,
                ip: ipAddress,
                loggerType: `Uma nova equipe foi criada com o nome: ${nameTeams}`
            }

            await Logger.create(newLogger);

            const createTeams = await Teams.create(newTeams)

            if (!createTeams) {
                return res.status(422).json({ error: 'Ops! Parece que houve um erro, tente novamente mais tarde.' })
            }

           return res.status(201).json({ msg: 'Equipe criada com sucesso.' })

        } catch (error) {
            console.error('Erro ao registrar', error);
            res.status(500).json({ msg: 'Erro ao cadastrar equipe.' })
        }
    },
    //Função Responsável por mostrar todas as equipes ou filtrar as equipes de acordo com a query
    searchTeams: async (req, res) => {
        try {
            const nameTeams = req.query.nameTeams;

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

    getAllTeams: async (req, res) => {
        try {
            const teams = await Teams.find();
            res.json(teams)
        } catch (error) {

            console.error('Usuário não encontrado', error);
            res.status(500).json({ msg: 'Usuário não encontrado' })
        }
    },



    //Função para atualizar a equipe
    updateTeams: async (req, res) => {
        try {
            const { idUser, teamsId, nameTeams, leader, viceLeader, members } = req.body;
            const userAdmin = await User.findById(idUser)
            const teamsUpdate = await Teams.findById(teamsId);

            if (!teamsUpdate) {
                return res.status(404).json({ msg: 'Ops! Equipe não encontrada.' });
            }

            if (userAdmin && userAdmin.userType !== 'Admin') {
                return res.status(404).json({ msg: 'Ops! Parece que você não é uma administrador.' });
            }

            teamsUpdate.nameTeams = nameTeams !== "" ? nameTeams : teamsUpdate.nameTeams;
            teamsUpdate.teamsType = teamsUpdate.teamsType;
            teamsUpdate.leader = leader !== "" ? leader : teamsUpdate.leader;
            teamsUpdate.viceLeader = viceLeader !== "" ? viceLeader : teamsUpdate.viceLeader;


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
            const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            const { idUser, teamsId } = req.body;
            const admin = await User.findById(idUser);
            const deleteTeam = await Teams.findById(teamsId)

            if (!deleteTeam) {
                return res.status(404).json({ error: 'Ops! Equipe ou órgão não encontrado' });
            }
            if (admin && admin.userType !== "Admin") {
                return res.status(404).json({ error: 'Ops! Parece que você não é uma administrador.' });
            }

            if (admin && admin.userType === "Admin" && deleteTeam) {
                await Teams.findByIdAndDelete(deleteTeam._id);
                createLogger("Excluiu a equipe de", admin.nickname, deleteTeam.nameTeams, ipAddress)
                return res.status(200).json({ error: 'Equipe deletada com sucesso.' });
            }

        } catch (error) {
            console.error('Não foi possível deletar a equipe', error);
            res.status(500).json({ error: 'Não foi possível deletar a equipe' })
        }
    },

};

module.exports = serviceControllerTeams;
