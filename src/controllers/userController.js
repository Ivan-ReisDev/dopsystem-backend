const { User } = require("../Models/useModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
      const passwordConf = "DOPsystem@@2024"
      const nickname = await User.findOne({ nick });
      if (nickname) {
        return res.status(422).json({ error: "Ops! Esse usuário já existe" });
      }

      const saltHash = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(passwordConf, saltHash);

      const newUser = {
        nickname: nick,
        patent: patent,
        classes: classes,
        teans: '',
        status: 'Pendente',
        password: passwordHash,
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
      const checkUser = await User.findOne({ nickname: nick })

      if (!checkUser) {
        return res.status(400).json({ error: 'Ops! Usuário não foi encontrado' })
      }

      if (checkUser.status === "Pendente") {
        return res.status(400).json({ error: 'Por favor crie sua conta no system.' })
      }

      const isMath = await bcrypt.compare(password, checkUser.password);
      if (!isMath || checkUser.nickname !== nick) {
        return res.status(400).json({ error: 'Ops! Nickname ou senha incorreto.' })
      }

      res.status(201).json({
        _id: checkUser._id,
        nickname: checkUser.nickname,
        patent: checkUser.patent,
        classes: checkUser.classes,
        teans: checkUser.teans,
        status: checkUser.status,
        userType: checkUser.userType,
        token: GenerateToken(checkUser._id)
      })

    } catch (error) {
      console.error("Erro ao efetuar o login.", error);
      res.status(500).json({ msg: "Erro ao efetuar o login." });
    }

  },

  updateUser: async (req, res) => {
    try {
      const { nick, password, passwordConf, securityCode } = req.body;
      const nickname = await User.findOne({ nickname: nick });
      const motto = await connectHabbo(nickname.nickname);

      if (!nickname) {
        res.status(404).json({ msg: 'Usuário não encontrado.' });
      };

      if (passwordConf !== password) {
        return res.status(422).json({ error: "Senha incorreta tente novamente." });
      };

      if (nickname.status !== 'Pendente') {
        return res.status(422).json({ error: "Ops! Este usuário já se encontra ativo" });
      };

      if (motto.motto !== securityCode) {
        return res.status(422).json({ error: "Ops! Seu código de acesso está errado, por favor verifique sua missão." });
      };

      const saltHash = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, saltHash);

      nickname.nickname = nickname.nickname;
      nickname.patent = nickname.patent;
      nickname.classes = nickname.classes;
      nickname.teans = nickname.teans;
      nickname.status = 'Ativo';
      nickname.password = passwordHash;
      nickname.userType = nickname.userType;

      await nickname.save();
      res.status(200).json({ msg: 'Usuário atualizado com sucesso' });

    } catch (error) {
      console.error('Não foi possível atualizar o usuário.', error);
      res.status(500).json({ msg: 'Não foi possível atualizar o usuário.' })
    }

  },

  //Para deletar é necessário passar um parametro que é o ID do usuário que será deletado e o nick do usuário que irá deletar.
  // O código irá verificar se quem está deletando é admin e se quem será deletado existe no banco de dados.
  deleteUsers: async (req, res) => {
    try {
      const userId = req.params.userId;
      const { nick } = req.body;
      const admin = await User.findOne({ nickname: nick });
      const deleteUser = await User.findOne({_id: userId})


      if (!deleteUser) {
        return res.status(404).json({ msg: 'Usuário não encontrado' });
      } 
      if (admin && admin.userType !== "Admin") {
        return res.status(404).json({ msg: 'Ops! Parece que você não é uma administrador.' });
      } 
      
      if(admin && admin.userType === "Admin" && deleteUser){
        await User.findByIdAndDelete(userId);
        return res.status(200).json({ msg: 'Usuário deletedo com sucesso' });
      }
       
      

    } catch (error) {
      console.error('Não foi possível deletar o usuário', error);
      res.status(500).json({ msg: 'Não foi possível deletar o usuário' })
    }

  },



  getAll: async (req, res) => {
    try {
      const users = await connectHabbo()
      console.log(users)
      return res.json(users)

    } catch (error) {

      console.error('Usuário não encontrado', error);
      res.status(500).json({ msg: 'Usuário não encontrado' })
    }

  },



};

module.exports = serviceControllerUser;
