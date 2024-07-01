const { User } = require("../Models/useModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { InfoSystem } = require('../Models/systemModel.js');
const { 
   connectHabbo,
   createLogger,
   tokenActiveDb,
   isTokenInvalide } = require('../utils/UserUtils.js');
const { query } = require("express");

const GenerateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

const serviceControllerUser = {
  // função para efetuar o login.
  login: async (req, res) => {
    try {
        const { nick, password } = req.body;
        const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        const checkUser = await User.findOne({ nickname: nick });

        if (!checkUser) {
            return res.status(400).json({ error: 'Ops! Usuário não encontrado' });
        }

        if (checkUser.status === "CFO") {
            return res.status(400).json({ error: 'Sua conta está suspensa até que termine seu CFO.' });
        }

        if (checkUser.status === "Pendente") {
            return res.status(400).json({ error: 'Por favor ative sua conta no sistema.' });
        }

        if (checkUser.status === "Desativado") {
            return res.status(400).json({ error: 'Ops! Parece que sua conta encontra-se desativada.' });
        }

        const isMatch = await bcrypt.compare(password, checkUser.password);
        if (!isMatch || checkUser.nickname !== nick) {
            return res.status(400).json({ error: 'Ops! Nickname ou senha incorreto.' });
        }

        await createLogger("Efetuou o login no sistema.", checkUser.nickname, " ", ipAddress);

        const tokenActive = GenerateToken(checkUser._id);
        await tokenActiveDb(checkUser.nickname, tokenActive);

        res.cookie('token', tokenActive, {
            httpOnly: true, // Configura o cookie como HttpOnly
            secure: false, // Garante que o cookie só seja enviado em conexões HTTPS
            sameSite: 'Strict', // Garante que o cookie só seja enviado no mesmo site
            maxAge: 24 * 60 * 60 * 1000 // Define a expiração para 1 dia (em milissegundos)
        });

        if (checkUser.tokenActive) {
            await isTokenInvalide(checkUser.nickname, checkUser.tokenActive);
        }

        return res.status(201).json({
            _id: checkUser._id,
            nickname: checkUser.nickname,
            patent: checkUser.patent,
            classes: checkUser.classes,
            teans: checkUser.teans, // Corrigido de 'teans' para 'teams'
            status: checkUser.status,
            userType: checkUser.userType,
            ip: ipAddress
        });

    } catch (error) {
        console.error("Erro ao efetuar o login:", error);
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

        if (motto.motto.trim() !== securityCode) {
          return res.status(404).json({ msg: "Ops! Seu código de acesso está errado, por favor verifique sua missão." });
        };

        if (nickname.status === 'Pendente' || nickname.status === 'Ativo') {

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
          return res.status(200).json({ msg: 'Usuário ativado com sucesso' });

        };

        return res.status(404).json({ msg: "Ops! Este usuário já se encontra ativo" });
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
      const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      const { idUser, idEdit, nickname, patent, status, tag, warnings, medals, userType } = req.body;
      const admin = await User.findOne({ _id: idUser });
      const cont = await User.findOne({ _id: idEdit });

      if (!admin || !cont) {
        res.status(404).json({ error: 'Dados não encontrados.' });
      } else {

        if (admin.userType === "Admin") {

          cont.nickname = nickname ? nickname : cont.nickname;
          cont.classes = cont.classes;
          cont.teans = cont.teans;
          cont.patent = patent ? patent : cont.patent;
          cont.status = status ? status : cont.status;
          cont.tokenActive = status !== cont.status ? " " : cont.tokenActive
          cont.tag = tag ? tag : cont.tag;
          cont.warnings = warnings ? warnings : cont.warnings;
          cont.medals = medals ? medals : cont.medals;
          cont.password = cont.password;
          cont.userType = userType ? userType : cont.userType;
          await cont.save();
          await createLogger(`Alterou o perfil do usuário ${cont.nickname}`, admin.nickname, "", ipAddress)
          return res.status(200).json({ msg: 'Usuário atualizado com sucesso.' });
        }

        return res.status(403).json({ error: 'Você nao tem permissão para atualizar esse usuário.' });

      };

    } catch (error) {
      console.error('Não foi possível atualizar o usuário.', error);
      res.status(500).json({ msg: 'Não foi possível atualizar o usuário.' })
    }

  },

  createTag: async (req, res) => {
    try {
      const { idUser, tag } = req.body;
      const cont = await User.findOne({ _id: idUser });

      if (!cont) {
        return res.status(404).json({ error: 'Dados não encontrados.' });
      }

      // Transforma o nickname em minúsculas para tornar a comparação insensível a maiúsculas/minúsculas
      const nicknameLower = cont.nickname.toLowerCase();

      // Verifica se todas as letras da tag estão presentes no nickname
      const tagOk = [...tag.toLowerCase()].every(letra => nicknameLower.includes(letra));

      if (tagOk) {
        cont.tag = tag ? tag : cont.tag;

        await cont.save();
        return res.status(200).json({ msg: 'Tag cadastrada com sucesso' });
      } else {
        return res.status(400).json({ error: 'Os caracteres não estão presentes no seu nickname.' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Ocorreu um erro ao processar a requisição.' });
    }

  },



  deleteUsers: async (req, res) => {
    try {
      const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      const userId = req.params.userId;
      const { nick } = req.body;
      const admin = await User.findOne({ nickname: nick });
      const deleteUser = await User.findOne({ _id: userId })


      if (!deleteUser) {
        return res.status(404).json({ msg: 'Usuário não encontrado' });
      }
      if (admin && admin.userType !== "Admin") {
        return res.status(404).json({ error: 'Ops! Parece que você não é uma administrador.' });
      }

      if (admin && admin.userType === "Admin" && deleteUser) {
        await User.findByIdAndDelete(userId);
        await createLogger(`Deletou o usuário ${deleteUser.nickname}`, admin.nickname, "", ipAddress)
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
        const { password, token, tokenActive, tokenIsNotValide, ...safeUser } = user.toObject();

        res.status(200).json(safeUser);
    } catch (error) {
        console.log('Perfil não encontrado');
        res.status(500).json({ errors: ["Perfil não encontrado."] });
    }
},

  getAll: async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const nickname = req.query.nickname; // Captura o nickname da query string

        let query;
        if (nickname) {
            query = User.find({ nickname: nickname }).select("-password");
        } else {
            query = User.find().select("-password");
        }

        const users = await query
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        res.json(users);
    } catch (error) {
        console.error('Erro ao recuperar usuários:', error); // Log mais detalhado do erro
        res.status(500).json({ error: 'Erro ao recuperar usuários' });
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
        if (typeRequeriment === "Promoção") {
          const indexRealOperator = patentRelegationIndex + 1;
          return info.patents[indexRealOperator];
        }

        if (typeRequeriment === "Rebaixamento") {
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
        const  nickname  = req.query.nickname;
        const userDb = await User.findOne({nickname: nickname});
        console.log(userDb.tokenActive)
        await isTokenInvalide(nickname, userDb.tokenActive);

        res.clearCookie('token');
        const user = req.user;
        console.log("Usuário fez logout:", nickname); // Exemplo de log para depuração
        res.status(200).json({ message: 'Logout realizado com sucesso.' });
    } catch (error) {
        console.error('Erro durante o logout:', error);
        res.status(500).json({ errors: ['Ocorreu um erro durante o logout.'] });
    }
},


};

module.exports = serviceControllerUser;
