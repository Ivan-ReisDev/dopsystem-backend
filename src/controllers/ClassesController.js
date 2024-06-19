const { User } = require("../Models/useModel.js");
const { Logger } = require('../Models/logsModel')
const { Classes } = require('../Models/classesModel.js')
const { Requirements } = require("../Models/RequirementsModel");
const { Teams } = require("../Models/teamsModel");
const mongoose = require('mongoose');
const { createLogger, register, RegisterContExist, connectHabbo } = require('../utils/UserUtils.js')



const updateProfileClasse = async (id, classe) => {
    const student = await User.findById(id);
    let newClasse = student.classes ;
    newClasse.push(classe);
    student.nickname = student.nickname;
    student.classes = newClasse;
    student.teans = student.teans;
    student.patent = student.patent
    student.status = student.status;
    student.tag =  student.tag;
    student.warnings = student.warnings;
    student.medals = student.medals;
    student.password = student.password;
    student.userType = student.userType;
    student.save()
  
}


// const createClasseTeamUpdate = async (team, classes) => {
//   try {
//     const teamsUpdate = await Teams.findOne({nameTeams: team});

//     if (teamsUpdate) {

//       teamsUpdate.nameTeams = teamsUpdate.nameTeams;
//       teamsUpdate.teamsType = teamsUpdate.teamsType;
//       teamsUpdate.leader = teamsUpdate.leader;
//       teamsUpdate.viceLeader = teamsUpdate.viceLeader;
//       teamsUpdate.members = teamsUpdate.members;
//       teamsUpdate.classes = classes !== ""? [...teamsUpdate.classes, classes ] : teamsUpdate.classes;

//       return await teamsUpdate.save();
//   } else {
//       return res.status(403).json({ msg: 'Ops! Parece que você não tem permissão para editar essa aula.' });
//   }


// } catch (error) {
//     console.error('Ops! Não foi possível atualizar a equipe ou órgão.', error);
//     res.status(500).json({ msg: 'Ops! Não foi possível atualizar a equipe ou órgão.' })
// }



// }

const serviceControllerClasse = {
  //student, teacher, nameClasse, team, comments
  createClasse: async (req, res) => {
    try {
      const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const { idUser, nameClasse, team, patent } = req.body;
      const userAdmin = await User.findById(idUser);
      const teamsUpdate = await Teams.findOne({ nameTeams: team });

      if (!nameClasse || !team || !patent || !userAdmin) {
        return res.status(422).json({ error: "Por favor preencha todos os campos." });
      }

      const classe = await Classes.findOne({ nameClasse: nameClasse });

      if (classe) {
        return res.status(422).json({ error: "Ops! Essa aula já existe" });
      }

      if (userAdmin.userType === 'Admin' || (teamsUpdate.leader === userAdmin.nickname)) {
        const newClasse = {
          nameClasse,
          team,
          patent
        };

        const createClasse = await Classes.create(newClasse);
        await createLogger("Criou uma nova aula", userAdmin.nickname, nameClasse, ipAddress);
        return !createClasse
          ? res.status(422).json({ error: "Houve um erro, tente novamente mais tarde" })
          : res.status(201).json({ msg: "Aula criada com sucesso." });

      } else {
        return res.status(403).json({ msg: 'Ops! Parece que você não tem permissão para editar essa aula.' });
      }


    } catch (error) {
      console.error("Erro ao criar aula.", error);
      res.status(500).json({ msg: "Erro ao criar aula." });
    }
  },

  deleteClasse: async (req, res) => {
    try {
        const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const { idUser, idClass } = req.body;
        const admin = await User.findById(idUser);
        const deleteClasse = await Classes.findById(idClass)

        if (!deleteClasse) {
            return res.status(404).json({ error: 'Ops! Essa aula não foi encontrada' });
        }
        if (admin && admin.userType !== "Admin") {
            return res.status(404).json({ error: 'Ops! Parece que você não é uma administrador.' });
        }

        if (admin && admin.userType === "Admin" && deleteClasse) {
            await Classes.findByIdAndDelete(deleteClasse._id);
            await createLogger("Excluiu a aula ", admin.nickname, deleteClasse.nameClasse, ipAddress)
            return res.status(200).json({ msg: 'Aula deletada com sucesso.' });
        }

    } catch (error) {
        console.error('Não foi possível deletar essa aula', error);
        return res.status(500).json({ error: 'Não foi possível deletar essa aula' })
    }
},

  postClasse: async (req, res) => {
    try {
      const { idUser, promoted, reason, classe, team } = req.body;
      const nicknameDocente = await User.findOne({ _id: idUser });
      const nicknameStudant = await User.findOne({ nickname: promoted });
      const teamDb = await Teams.findOne({ nameTeams: team });
      const classeDb = await Classes.findOne({ nameClasse: classe });
      const membersTeam = teamDb.members.some(member => member.nickname === nicknameDocente.nickname);

      if (!idUser || !promoted || !reason || !classe || !team) {
        return res.status(404).json({ error: 'Por favor preencha todos os campos solicitados' });

      } else if (!nicknameDocente || !nicknameStudant || !classeDb || !teamDb) {
        return res.status(400).json({ error: 'Dados não encontrados, por favor tente mais tarde' });

      } else if (nicknameDocente.userType === "Admin" || nicknameDocente.userType === "Diretor" || membersTeam || nicknameDocente.nickname === teamDb.leader || nicknameDocente.nickname === teamDb.viceLeader) {

        await updateProfileClasse(nicknameStudant._id, classeDb.nameClasse)

        const newRequirement = {
          promoted: nicknameStudant.nickname,
          classe: classeDb.nameClasse,
          reason,
          operator: nicknameDocente.nickname,
          team: teamDb.nameTeams,
          typeRequirement: "Aula",
          status: "Aprovado"
        };

        const createRequirement = await Requirements.create(newRequirement);

        if (!createRequirement) {
          return res.status(422).json({ error: 'Ops! Parece que houve um erro, tente novamente mais tarde.' });
        }

        return res.status(201).json({ msg: 'Requerimento postado com sucesso.' });


      } else {
        return res.status(403).json({ msg: 'Parece que você não tem permissão para fazer essa postagem.' });

      }

    } catch (error) {
      console.error('Erro ao postar requerimento.', error);
      res.status(500).json({ msg: 'Erro ao postar requerimento.' });
    }
  },

  postCI: async (req, res) => {
    try {
      const { idUser, student, reason } = req.body;
      const nicknameDocente = await User.findOne({ _id: idUser });
      const nicknameUser = await User.findOne({ nickname: student });
  
      if (!idUser || !reason || !student) {
        return res.status(404).json({ error: 'Por favor preencha todos os campos solicitados' });
      }

      const responseHabbo = await connectHabbo(student.trim());
      if(responseHabbo === "error") {
        return res.status(404).json({ error: 'Este usuário não existe no Habbo Hotel' });
      }
  
      if (!nicknameDocente) {
        return res.status(400).json({ error: 'Dados não encontrados, por favor tente mais tarde' });
      }
  
      if (nicknameUser) {
        const response = await RegisterContExist(nicknameUser.nickname, "Soldado", "Curso Inicial [C.I]");
  
        if (response.status === false) {
          return res.status(400).json({ error: response.info });
        }
      } else {
        const registrered = await register(student.trim(), "Soldado");
        if (registrered.status === false) {
          return res.status(422).json({ error: registrered.info });
        }
      }
  
      const newRequirement = {
        promoted: student,
        classe: "Curso Inicial [C.I]",
        reason,
        operator: nicknameDocente.nickname,
        team: 'Corpo de Funcionários',
        typeRequirement: "Aula",
        status: "Aprovado"
      };
  
      const createRequirement = await Requirements.create(newRequirement);
      if (!createRequirement) {
        return res.status(422).json({ error: 'Ops! Parece que houve um erro, tente novamente mais tarde.' });
      }
  
      return res.status(201).json({ msg: 'Requerimento postado com sucesso.' });
    } catch (error) {
      console.error('Erro ao postar requerimento.', error);
      res.status(500).json({ error: 'Erro ao postar requerimento.' });
    }
  },
  
  updateClasse: async (req, res) => {
    try {
      const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const { idUser, idClasse, nameClasse, team, patent } = req.body;

      // Validação do ID do documento
      if (!mongoose.Types.ObjectId.isValid(idClasse)) {
        return res.status(400).json({ msg: 'ID da aula inválido.' });
      }

      if (!team) {
        return res.status(400).json({ msg: 'Ops! Por favor preencha o campo de equipe.' });
      }

      const userAdmin = await User.findById(idUser);
      const classeUpdate = await Classes.findById(idClasse);
      const teamUpdate = await Teams.findOne({ nameTeams: team });

      if (!classeUpdate || !userAdmin || !teamUpdate) {
        return res.status(404).json({ msg: 'Ops! Dados não encontrados, por favor tente mais tarde.' });
      }

      if (userAdmin.userType === 'Admin' || (teamUpdate.leader === userAdmin.nickname)) {
        await createLogger("Editou o aula", userAdmin.nickname, classeUpdate.team, ipAddress);
        classeUpdate.nameClasse = nameClasse || classeUpdate.nameClasse;
        classeUpdate.team = team || classeUpdate.team;
        classeUpdate.patent = patent || classeUpdate.patent;
        await classeUpdate.save();
        return res.status(200).json({ msg: 'Aula atualizada com sucesso!' });
      } else {
        return res.status(403).json({ msg: 'Ops! Parece que você não tem permissão para editar essa aula.' });
      }

    } catch (error) {
      console.error('Ops! Não foi possível atualizar essa aula.', error);
      res.status(500).json({ msg: 'Ops! Não foi possível atualizar essa aula.' });
    }
  },


  getClasses: async (req, res) => {
    try {
      const users = await Classes.find();
      return res.json(users)

    } catch (error) {
      console.error('Aula não encontrado', error);
      res.status(500).json({ msg: 'Aula não encontrado' })
    }
  },

};

module.exports = serviceControllerClasse;
