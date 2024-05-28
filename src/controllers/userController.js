const { User } = require("../Models/useModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Logger } = require('../Models/logsModel')
const { InfoSystem } = require('../Models/systemModel.js')


// Função para gerar um token JWT com base no ID do usuário
const apiHabbo = `https://www.habbo.com.br/api/public/users?name=`
const GenerateToken = (id) => {
  return jwt.sign(
    { id },
    "KS1486735ANFSAN36454BFGSAF45471PKPEKGPSAGK1454EDGG",
    {
      expiresIn: "7d",
    }
  );
};



//Conecta com a API do habbo
const connectHabbo = async (nick) => {
  try {
    const res = await fetch(`${apiHabbo}${nick}`, {
      method: 'GET'
    });
    const data = await res.json();
    return data.error ? 'Usuário não encontrado' : data;
  } catch (error) {
    console.log(error);
  }
};

const serviceControllerUser = {

  register: async (req, res) => {
    try {
      const formdata = req.body;
      const { nick, patent, classes } = formdata;
      const passwordConf = `${process.env.USER_PASS_REGISTER}` 
      const nickname = await User.findOne({ nickname: nick });

      if (nickname) {
        return res.status(422).json({ error: "Ops! Esse usuário já existe" });
      }

      const saltHash = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(passwordConf, saltHash);

      const newUser = {
        nickname: nick,
        password: passwordHash,
        patent: patent,
        classes: classes,
        teans: '',
        status: 'Pendente',
        tag: 'Vazio',
        warnings: 0,
        medals: 0,
        userType: 'User',
      };

      const createUser = await User.create(newUser);
      return !createUser
        ? res.status(422).json({ error: "Houve um erro, tente novamente mais tarde" })
        : res.status(201).json({ msg: "Sua conta foi criada agora precisa ser aceita por um administrador." });

    } catch (error) {
      console.error("Erro ao registrar", error);
      res.status(500).json({ msg: "Erro ao efetuar cadastro" });
    }
  },

  // função para efetuar o login.
  login: async (req, res) => {
    try {
      const { nick, password } = req.body;
      const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
   
      const checkUser = await User.findOne({ nickname: nick })

      if (!checkUser) {
        return res.status(400).json({ error: 'Ops! Usuário não foi encontrado' })
      }

      if (checkUser.status === "Pendente") {
        return res.status(400).json({ error: 'Por favor ative sua conta no system.' })
      }

      if (checkUser.status === "Desativado") {
        return res.status(400).json({ error: 'Ops! Parece que sua conta encontra-se desativada.' })
      }

      const isMath = await bcrypt.compare(password, checkUser.password);
      if (!isMath || checkUser.nickname !== nick) {
        return res.status(400).json({ error: 'Ops! Nickname ou senha incorreto.' })
      }

  

      const newLogger = {
        user: checkUser.nickname,
        ip: ipAddress,
        loggerType: "Efetuou o login no system"
      }

      await Logger.create(newLogger);

      return res.status(201).json({
        _id: checkUser._id,
        nickname: checkUser.nickname,
        patent: checkUser.patent,
        classes: checkUser.classes,
        teans: checkUser.teans,
        status: checkUser.status,
        userType: checkUser.userType,
        token: GenerateToken(checkUser._id),
        ip: ipAddress
      })

    } catch (error) {
      console.error("Erro ao efetuar o login.", error);
      res.status(500).json({ msg: "Erro ao efetuar o login." });
    }

  },

  updateUser: async (req, res) => {
    try {
      const { securityCode, formdata } = req.body;
      const { newUserDopSystem, newPasswordDopSystem, newPasswordDopSystemConf } = formdata;
      const nickname = await User.findOne({ nickname: newUserDopSystem });

      if (!nickname) {
        res.status(404).json({ msg: 'Ops! Usuário não encontrado.' });
      } else {

        const motto = await connectHabbo(nickname.nickname);

        if (newPasswordDopSystemConf !== newPasswordDopSystem) {
          return res.status(404).json({ msg: "Senha incorreta tente novamente." });
        };

        if (nickname.status !== 'Pendente') {
          return res.status(404).json({ msg: "Ops! Este usuário já se encontra ativo" });
        };

        if (motto.motto !== securityCode) {
          return res.status(404).json({ msg: "Ops! Seu código de acesso está errado, por favor verifique sua missão." });
        };

        const saltHash = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPasswordDopSystem, saltHash);

        nickname.nickname = nickname.nickname;
        nickname.patent = nickname.patent;
        nickname.classes = nickname.classes;
        nickname.teans = nickname.teans;
        nickname.status = 'Ativo';
        nickname.tag = nickname.tag;
        nickname.warnings = nickname.warnings;
        nickname.medals = nickname.medals;
        nickname.password = passwordHash;
        nickname.userType = nickname.userType;

        await nickname.save();
        res.status(200).json({ msg: 'Usuário ativado com sucesso' });

      };

    } catch (error) {
      console.error('Não foi possível atualizar o usuário.', error);
      res.status(500).json({ msg: 'Não foi possível atualizar o usuário.' })
    }

  },

  //Para deletar é necessário passar um parametro que é o ID do usuário que será deletado e o nick do usuário que irá deletar.
  // O código irá verificar se quem está deletando é admin e se quem será deletado existe no banco de dados.
  
  updateUserAdmin: async (req, res) => {
    try {
      const { idUser, idEdit, nickname, patent, status, tag, warnings, medals, userType } = req.body;
      const admin = await User.findOne({ _id: idUser });
      const cont = await User.findOne({_id: idEdit});

      if (!admin || !cont) {
        res.status(404).json({ error: 'Dados não encontrados.' });
      } else {

        if(admin.userType === "Admin") {

          cont.nickname = nickname ? nickname : cont.nickname;
          cont.classes = cont.classes; 
          cont.teans = cont.teans;
          cont.patent = patent ? patent : cont.patent;
          cont.status = status ? status : cont.status;
          cont.tag = tag ? tag : cont.tag;
          cont.warnings = warnings ? warnings : cont.warnings;
          cont.medals = medals ? medals : cont.medals;
          cont.password =  cont.password;
          cont.userType = userType ? userType :cont.userType;
  
          await cont.save();
          return res.status(200).json({ msg: 'Usuário atualizado com sucesso.' });
        }

        return res.status(403).json({ error: 'Você nao tem permissão para atualizar esse usuário.' });

      };

    } catch (error) {
      console.error('Não foi possível atualizar o usuário.', error);
      res.status(500).json({ msg: 'Não foi possível atualizar o usuário.' })
    }

  },

  
  
  
  
  
  deleteUsers: async (req, res) => {
    try {
      const userId = req.params.userId;
      const { nick } = req.body;
      const admin = await User.findOne({ nickname: nick });
      const deleteUser = await User.findOne({ _id: userId })


      if (!deleteUser) {
        return res.status(404).json({ msg: 'Usuário não encontrado' });
      }
      if (admin && admin.userType !== "Admin") {
        return res.status(404).json({ msg: 'Ops! Parece que você não é uma administrador.' });
      }

      if (admin && admin.userType === "Admin" && deleteUser) {
        await User.findByIdAndDelete(userId);
        return res.status(200).json({ msg: 'Usuário deletedo com sucesso' });
      }

    } catch (error) {
      console.error('Não foi possível deletar o usuário', error);
      res.status(500).json({ msg: 'Não foi possível deletar o usuário' })
    }

  },


  getcurrentUser: async (req, res) => {
    try {
      const user = req.user;
      res.status(200).json(user);

    } catch (error) {
      console.log('Perfil não encontrado')
    }

  },

  getAll: async (req, res) => {
    try {
        // Consulta para obter todos os usuários, excluindo a senha
        const users = await User.find().select("-password");
        // Envia os usuários sem a senha como resposta
        res.json(users);
    } catch (error) {
        console.error('Usuário não encontrado', error);
        res.status(500).json({ msg: 'Usuário não encontrado' });
    }
},

  getAllNicks: async (req, res) => {
    try {
      const users = await User.find();
      // Mapeia a lista de usuários para extrair apenas os apelidos
      const nicknames = users.map(user => user.nickname);

      return res.json(nicknames);

    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return res.status(500).json({ msg: 'Erro ao buscar usuários' });
    }
  },

  searchUser: async (req, res) => {
    try {
      const nickname = req.query.nickname;
      const typeRequeriment = req.query.typeRequeriment;
      const users = await User.find().sort({ nickname: 1 }).select("-password");
      const resUser = nickname
          ? users.filter(user => user.nickname.includes(nickname))
          : users;
      const info = await InfoSystem.findOne();
      if (!info || !info.patents || !info.paidPositions) {
          return res.status(500).json({ msg: 'Informações do sistema não encontradas.' });
      }
  
      const newPatents = resUser.map(user => {
          const patentRelegationIndex = info.patents.includes(user.patent)
              ? info.patents.indexOf(user.patent)
              : info.paidPositions.indexOf(user.patent);
        if( typeRequeriment === "Promoção") {
          const indexRealOperator = patentRelegationIndex + 1;
          return info.patents[indexRealOperator];
        }

        if(typeRequeriment === "Rebaixamento") {
          const indexRealOperator = patentRelegationIndex - 1;
          return info.patents[indexRealOperator];
        }

      });
  
      return res.json({ users: resUser, newPatents: newPatents });
  } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },



  logoutPass: async (req, res) => {
    try {
      const user = req.user;
      res.logout()
      res.status(200).json(user);

    } catch (error) {
      console.log('Ocorreu um Erro.')
    }

  },



};

module.exports = serviceControllerUser;
