const { Teams } = require("../Models/teamsModel");
const { User } = require("../Models/useModel");
const { DocsSystem } = require("../Models/docsModel");
const { Classes } = require("../Models/classesModel");
const { createLogger } = require("../utils/UserUtils")
const mongoose = require('mongoose');


const createClasse = async (classe, team) => {
    try {
        const newClasse = {
          nameClasse: classe,
          team: team,
          patent: "Todas"
        };

        const classeCriada = await Classes.create(newClasse);
        return classeCriada ? "Aula criada com sucesso." : "Não foi possível criar a aula.";

    } catch (error) {
        console.error("Erro ao criar aula.", error);
    }
}



const serviceControllerDocs = {
    //Função responsável por criar a equioe
    createDocs: async (req, res) => {
        try {
            const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            const { idUser, nameDocs, content, docsType, script } = req.body;
            console.log(`idUser ${idUser} , nameDocs ${nameDocs}, content ${content}, docsType ${docsType}, script ${script}`)
            const nickname = await User.findOne({ _id: idUser });
            const teams = await Teams.findOne({ nameTeams: docsType });
    
            if (!nameDocs || !content || content === "<p><br></p>" || !docsType) {
                return res.status(422).json({ error: 'Ops! Parece que você não preencheu todos os dados' });
            }
    
            if(script === true) {
                await createClasse(nameDocs, docsType)
            }
    
            if (nickname && (nickname.userType === "Admin" || nickname.nickname === teams.leader || nickname.nickname === teams.viceLeader || nickname.userType === "Diretor")) {
                const newDoc = {
                    nameDocs: nameDocs,
                    content: content,
                    create: nickname.nickname,
                    docsType: docsType,
                    status: "Ativo",
                    script,
                };
                await createLogger("Criou um novo documento", nickname.nickname, nameDocs, ipAddress);
                const docCriado = await DocsSystem.create(newDoc);
    
                if (!docCriado) {
                    return res.status(422).json({ error: 'Ops! Parece que houve um erro, tente novamente mais tarde.' });
                }
    
                return res.status(201).json({ msg: 'Documento criado com sucesso.' });
            }
    
            return res.status(422).json({ error: 'Ops! Parece que você não tem permissão para postar essa aula.' });
    
        } catch (error) {
            console.error('Erro ao registrar', error);
            return res.status(500).json({ msg: 'Erro ao criar documento.' });
        }
    },

    getAllDocs: async (req, res) => {
        try {
            // Definindo o número da página padrão como 1 e o tamanho padrão da página como 10, 
            // mas você pode ajustá-los conforme necessário.
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
    
            // Calcular o índice do primeiro documento a ser recuperado com base no número da página e no tamanho da página.
            const startIndex = (page - 1) * limit;
    
            // Consulta os documentos usando o método find() com skip() e limit() para a paginação.
            const docs = await DocsSystem.find().skip(startIndex).limit(limit);
    
            res.json(docs);
        } catch (error) {
            console.error('Documento não encontrado', error);
            res.status(500).json({ msg: 'Documento não encontrado' })
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

    //Função para atualizar a equipe
    updateDocs: async (req, res) => {
        try {
            const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            const { idUser, nameDocs, content, docsType, idDoc, script } = req.body;
    
            // Validação do ID do documento
            if (!mongoose.Types.ObjectId.isValid(idDoc)) {
                return res.status(400).json({ error: 'ID do documento inválido.' });
            }
    
            const userAdmin = await User.findById(idUser);
            const docUpdate = await DocsSystem.findById(idDoc);
            const teams = await Teams.findOne({ nameTeams: docsType });
            
            // Validação da existência do documento
            if (!docUpdate) {
                return res.status(404).json({ error: 'Ops! Documento não encontrado.' });
            }
    
            if (userAdmin && (userAdmin.userType === "Admin" || (teams && userAdmin.nickname === teams.leader || nickname.nickname === teams.viceLeader ) || userAdmin.userType === "Diretor")) {
                
                if (script === true) {
                    await createClasse(nameDocs, docsType);
                }
    
                docUpdate.nameDocs = nameDocs || docUpdate.nameDocs;
                docUpdate.content = content || docUpdate.content;
                docUpdate.docsType = docsType || docUpdate.docsType;
                docUpdate.script = script !== undefined ? script : docUpdate.script;
    
                await docUpdate.save();
                await createLogger("Editou o documento", userAdmin.nickname, docUpdate.nameDocs, ipAddress);
                return res.status(200).json({ msg: 'Documento atualizado com sucesso!' });
            }
            
            return res.status(403).json({ error: 'Ops! Parece que você não é um administrador.' });
        } catch (error) {
            console.error('Ops! Não foi possível atualizar o documento.', error);
            res.status(500).json({ error: 'Ops! Não foi possível atualizar o documento.' });
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

            if (admin && (admin.userType === "Admin" || admin.userType === "Diretor")) {
                await DocsSystem.findByIdAndDelete(deleteDoc._id);
                await createLogger("Deletou o documento", admin.nickname, deleteDoc.nameDocs, ipAddress);

                return res.status(200).json({ msg: 'Documento deletedo com sucesso' });

            } else if (TeamSelect.leader === admin.nickname) {
                await DocsSystem.findByIdAndDelete(deleteDoc._id);
                await createLogger("Deletou o documento", admin.nickname, deleteDoc.nameDocs, ipAddress);
                return res.status(200).json({ msg: 'Documento deletedo com sucesso' });

            } else {
                return res.status(404).json({ msg: 'Ops! Parece que você não é um administrador.' });
            }



        } catch (error) {
            console.error('Não foi possível deletar o documento.', error);
            res.status(500).json({ msg: 'Não foi possível deletar o documento.' })
        }
    },

    searchDoc: async (req, res) => {
        try {
            const document = req.query.typeDocument;
            
            if (!document) {
                return res.status(400).json({ error: 'O tipo de documento não foi fornecido.' });
            }
    
            const docsType = await DocsSystem.find({ docsType: document }).select("-content");
    
            // Verifica se há documentos encontrados
            if (docsType.length === 0) {
                return res.json([]); // Retorna um array vazio se não houver documentos encontrados
            }
    
            const resUser = docsType.filter(doc => doc.docsType.includes(document));
            
            return res.json(resUser);
    
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    },
    

searchDoc: async (req, res) => {
    try {
        const document = req.query.typeDocument;
        
        if (!document) {
            return res.status(500).json({ error: 'Informações do sistema não encontradas.' });
        }

        const docsType = await DocsSystem.find({ docsType: document }).select("-content");

        const resUser = docsType.filter(doc => doc.docsType.includes(document));
        
        return res.json(resUser);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
},

searchDocCompleted: async (req, res) => {
    try {
        const document = req.query.idDocument;
        
        if (!document) {
            return res.status(500).json({ error: 'Informações do sistema não encontradas.' });
        }
        const docsType = await DocsSystem.findOne({ _id: document });
        return res.json(docsType);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
},

}
module.exports = serviceControllerDocs;
