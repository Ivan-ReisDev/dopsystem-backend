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


//Gerar prefixo PASSAR PARA O FRONT-END
const generatePreFixo = () => {
  const code = Math.ceil(Math.random() * 9999);
  return `DOP-8941`
  //DOP-8941
}

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
      const { nick, passwordConf, userType, patent, classes } = formdata;
      const password = "DOPsystem@@2024"
      const motto = await connectHabbo(nick);
      const confirmPreFixo = generatePreFixo()
      const nickname = await User.findOne({ nick });
      if (motto.motto !== confirmPreFixo) {
        return res.status(422).json({ error: "Ops! Seu código de acesso está errado, por favor verifique sua missão." });
      }

      if (nickname) {
        return res.status(422).json({ error: "Ops! Esse usuário já existe" });
      }

      if (passwordConf !== password) {
        return res.status(422).json({ error: "Senha incorreta tente novamente." });
      }
      const saltHash = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, saltHash);

      const newUser = {
        nickname: nick,
        patent: patent,
        classes: classes,
        status: 'Pendente',
        password: passwordHash,
        userType: userType,
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
    const { nick, password } = req.body;
    const checkUser = await User.findOne({ nick })

    if (!checkUser) {
      return res.status(400).json({ error: 'Ops! Usuário não foi encontrado' })
    }

    const isMatch = await bcrypt.compare(password, checkUser.password)

    return !isMatch
      ? res.status(401).json({ error: 'Ops! Nickname ou senha incorreto.' })
      : res.status(201).json({
        _id: checkUser._id,
        nickname: checkUser.nickname,
        patent: checkUser.patent,
        classes: checkUser.classes,
        status: checkUser.status,
        userType: checkUser.userType,
        token: GenerateToken(checkUser._id)
      })
  },


  updateUser: async (req, res) => {
    try {
        const userId = req.params.userId;
        const { nick, password, securityCode } = req.body;
        const updateUser = await User.findById(userId)
        if (!updateUser) {
            res.status(404).json({ msg: 'Usuário não encontrado.' });
        }

        const saltHash = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, saltHash);


        updateUser.user = user.toLowerCase();
        updateUser.email = email.toLowerCase();
        updateUser.password = passwordHash;
        updateUser.userType = userType;


        await updateUser.save()

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
      const { nick } = req.body
      const admin = await User.findOne({ nick });
      const deleteUser = await User.findByIdAndDelete(userId)
      
      if (admin && admin.userType !== "Admin") {
        return res.status(404).json({ msg: 'Ops! Parece que você não é uma administrador.' });

      } else if (!deleteUser) {
        return res.status(404).json({ msg: 'Usuário não encontrado' });

      } else {
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
