const { Teams } = require("../Models/teamsModel");
const { User } = require("../Models/useModel");
const { DocsSystem } = require("../Models/docsModel");
const { Logger } = require('../Models/logsModel')
const mongoose = require('mongoose');

const createLogger = async (action, user,  name, ip) => {
    const newLogger = {
        user: user,
        ip: ip,
        loggerType: `${action} ${name}`
      }

      await Logger.create(newLogger);

}


const serviceControllerDocs = {
    //Função responsável por criar a equioe
    createDocs: async (req, res) => {
        try {
            const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            const { idUser, nameDocs, content, docsType } = req.body;
            const nickname = await User.findOne({ _id: idUser });
            console.log(nickname)
            if (nickname && nickname.userType !== "Admin") {
                return res.status(422).json({ error: 'Ops! Você não é um administrador.' })
            }     

            if (!nameDocs || !content || content === "<p><br></p>" || !docsType) {
                return res.status(422).json({ error: 'Preencha todos os campos' })
            }

            const newDoc = {
                nameDocs: nameDocs,
                content: content,
                create: nickname.nickname,
                docsType: docsType,
                status: "Ativo"
            }

            const newLogger = {
                user: nickname.nickname,
                ip: ipAddress,
                loggerType: `Um novo documento foi criado com o nome: ${nameDocs}`
              }
              
            await Logger.create(newLogger);
              
            const createDocs = await DocsSystem.create(newDoc);

            if (!createDocs) {
                return res.status(422).json({ error: 'Ops! Parece que houve um erro, tente novamente mais tarde.' })
            }

            res.status(201).json({ msg: 'Documento criado com sucesso.' })

        } catch (error) {
            console.error('Erro ao registrar', error);
            res.status(500).json({ msg: 'Erro ao criar documento documento.' })
        }
    },

    getAllDocs: async (req, res) => {
        try {
          const docs = await DocsSystem.find();
          res.json(docs);

        } catch (error) {
    
          console.error('Documento não encontrado', error);
          res.status(500).json({ msg: 'Documento não encontrado' })
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
    updateDocs: async (req, res) => {
        try {
            const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            const { idUser, nameDocs, content, docsType, idDoc } = req.body;
            console.log(`docId: ${idDoc}, idUser: ${idUser}, nameDocs: ${nameDocs}, content: ${content}, docsType: ${docsType}`);
    
            // Validação do ID do documento
            if (!mongoose.Types.ObjectId.isValid(idDoc)) {
                return res.status(400).json({ msg: 'ID do documento inválido.' });
            }
    
            const userAdmin = await User.findById(idUser);
            const docUpdate = await DocsSystem.findById(idDoc);
    
            if (!docUpdate) {
                console.log('Ops! Documento não encontrado.');
                return res.status(404).json({ msg: 'Ops! Documento não encontrado.' });
            }
    
            if (userAdmin && userAdmin.userType !== 'Admin') {
                return res.status(403).json({ msg: 'Ops! Parece que você não é um administrador.' });
            }
    
            docUpdate.nameDocs = nameDocs ? nameDocs : docUpdate.nameDocs;
            docUpdate.content = content ? content : docUpdate.content;
            docUpdate.docsType = docsType ? docsType : docUpdate.docsType;
    
            await docUpdate.save();
            createLogger("Editou o documento", userAdmin.nickname, docUpdate.nameDocs, ipAddress)
            res.status(200).json({ msg: 'Documento atualizado com sucesso!' });
    
        } catch (error) {
            console.error('Ops! Não foi possível atualizar o documento.', error);
            res.status(500).json({ msg: 'Ops! Não foi possível atualizar o documento.' });
        }
    },
    
    //Função responsável por deletar uma equipe de acordo com o id params dela.
    deleteDocs: async (req, res) => {
        try {
            const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            const { idUser, idDoc, idTeam } = req.body;
            const admin = await User.findById(idUser)
            const TeamSelect = await Teams.findById(idTeam)
            const deleteDoc = await DocsSystem.findById(idDoc)

            if (!deleteDoc) {
                return res.status(404).json({ msg: 'Ops! Documento não encontrado' });
            }

            if (admin && admin.userType === "Admin" ) {
                await DocsSystem.findByIdAndDelete(deleteDoc._id);
                createLogger("Deletou o documento", admin.nickname, deleteDoc.nameDocs, ipAddress)
                return res.status(200).json({ msg: 'Documento deletedo com sucesso' });

            }  else if (TeamSelect.leader === admin.nickname) {
                await DocsSystem.findByIdAndDelete(deleteDoc._id);
                createLogger("Deletou o documento", admin.nickname, deleteDoc.nameDocs, ipAddress)
                return res.status(200).json({ msg: 'Documento deletedo com sucesso' });
                
            } else {
                return res.status(404).json({ msg: 'Ops! Parece que você não é um administrador.' });
            }

            
        
        } catch (error) {
            console.error('Não foi possível deletar o documento.', error);
            res.status(500).json({ msg: 'Não foi possível deletar o documento.' })
        }
    },

};

module.exports = serviceControllerDocs;
