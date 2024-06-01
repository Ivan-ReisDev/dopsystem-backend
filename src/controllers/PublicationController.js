const { Logger } = require('../Models/logsModel');
const { User } = require('../Models/useModel');
const { Teams } = require("../Models/teamsModel");
const { Publication } = require('../Models/PublicationModel')

const createLogger = async (action, user, name, ip) => {
    const newLogger = {
        user: user,
        ip: ip,
        loggerType: `${action} ${name}`
    }

    await Logger.create(newLogger);
}
//user, title, content, linkImg
const serviceControllerPublication = {
    createPublication: async (req, res) => {
        try {
            const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            const { idUser, title, content, linkImg } = req.body;
            const nickname = await User.findOne({_id: idUser});
            const team = await Teams.findOne({ nameTeams: "Marketing"});

            if (!idUser || !title || !content || !linkImg) {
                return res.status(422).json({ error: 'Preencha todos os campos' })
            }

            if(!nickname) {
                return res.status(404).json({error : "Usuário não encontrado"})
            }

            if(nickname && (nickname.userType === "Admin" || nickname.userType === "Diretor" || nickname.nickname ===  team.leader )) {

                const newPublication = {
                    user: nickname.nickname,
                    title, 
                    content,
                    linkImg,
                }

                const createPublications = await Publication.create(newPublication);
                if (!createPublications) {
                    return res.status(422).json({ error: 'Ops! Parece que houve um erro, tente novamente mais tarde.' })
                }
                
                await createLogger("Acabou de criar uma publicação", nickname.nickname, title, ipAddress)
                return  res.status(201).json({ msg: 'Publicação criada com sucesso.' })
            }

            return res.status(403).json({ error: 'Ops! Parece que você não tem permissão para efetuar essa operação.' })
           
        } catch (error) {
            console.error('Erro ao criar publicação', error);
            res.status(500).json({ error: 'Erro ao criar publicação.' })
        }
    },


    deletePublications: async (req, res) => {
        try {
          const { idUser, idPublication } = req.body;
          const admin = await User.findOne({ _id: idUser });
          const deletePublication = await Publication.findOne({ _id: idPublication })
          const team = await Teams.findOne({ nameTeams: "Marketing"});
          if (!deletePublication) {
            return res.status(404).json({ error: 'Publicação não encontrado' });
          }
    
          if (admin && (admin.userType === "Admin" || admin.userType === "Diretor"  || admin.nickname === team.leader) ) {
            await Publication.findByIdAndDelete(idPublication);
            return res.status(200).json({ msg: 'Publicação deleteda com sucesso' });
          }

          await createLogger("Acabou de criar uma publicação", admin.nickname, deletePublication.title, ipAddress)
          return res.status(404).json({ error: 'Ops! Você não tem permissão para excluir essa publicação.' })
    
        } catch (error) {
          console.error('Não foi possível deletar a publicação', error);
          res.status(500).json({ error: 'Não foi possível deletar a publicação' })
        }
    
      },


      getAllPublications: async (req, res) => {
        try {
            const publications = await Publication.find();
            res.json(publications)
        } catch (error) {

            console.error('Publicações não encontradas', error);
            res.status(500).json({ error: 'Publicações não encontradas' })
        }
    },
    

};

module.exports = serviceControllerPublication;
