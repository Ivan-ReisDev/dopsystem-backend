const { Logger } = require('../Models/logsModel');
const { User } = require("../Models/useModel.js");
const { DocsSystem } = require("../Models/docsModel.js")
const { InfoSystem } = require('../Models/systemModel.js')
const bcrypt = require("bcryptjs");
const { Teams } = require('../Models/teamsModel.js');
const apiHabbo = `https://www.habbo.com.br/api/public/users?name=`

// Conecta com a api de usuário do habbo
const connectHabbo = async (nick) => {
  try {
    const res = await fetch(`${apiHabbo}${nick}`, {
      method: 'GET'
    });
    const data = await res.json();
    return data.error ? 'error' : data;
  } catch (error) {
    console.log(error);
    return 'error';
  }
};

//Registra o a ação e o IP do usuário
const createLogger = async (action, user, name, ip) => {
  const newLogger = {
    user: user,
    ip: ip,
    loggerType: `${action} ${name}`
  }

  if(user === "DOPSystem"){
    return
  }

 return await Logger.create(newLogger);
}

//Armazena o Token atual no banco de dados
const tokenActiveDb = async (nickname, token) => {
  const user = await User.findOne({ nickname: nickname })
  if (user) {
    user.tokenActive = token;
    await user.save();  // Salva o documento do usuário, não o modelo
  } else {
    throw new Error('Usuário não encontrado');
  }
}

//Verifica se o usuário é diretor
const isDiretor = async (diretor) => {
  const info = await InfoSystem.findOne();

  const isValidado = info.patents.includes(diretor) ?
    info.patents.indexOf(diretor) :
    info.paidPositions.indexOf(diretor);
  return isValidado >= 14 ? true : false;

}

//Verifica se um usuário é superior a outro
const isSuperior = async (higher, subordinate, type, patentContract, req, res) => {
  let userAdmin = false;
  if(req){
     userAdmin = await User.findOne({_id: req.idUser})
  }

  const info = await InfoSystem.findOne();
  const diretor = isDiretor(higher);

  if (!info || !info.patents) {
    return res.status(500).json({ msg: 'Informações do sistema não encontradas.' });
  }

  const patentOperadorIndex = info.patents.includes(higher.patent) ?
    info.patents.indexOf(higher.patent) :
    info.paidPositions.indexOf(higher.patent);

  const patentPromotedIndex = info.patents.includes(!patentContract ? subordinate.patent : patentContract) ?
    info.patents.indexOf(!patentContract ? subordinate.patent : patentContract) :
    info.paidPositions.indexOf(!patentContract ? subordinate.patent : patentContract);

  const indexRealOperator = patentOperadorIndex - 2;
  if (patentPromotedIndex <= indexRealOperator || diretor === true || userAdmin.userType === "Admin") {

    let newIndexPatent;

    switch (type) {
      case "Promoção":
        newIndexPatent = patentPromotedIndex + 1;
        newPatent = info.patents.includes(subordinate.patent) ? info.patents[newIndexPatent] : info.paidPositions[newIndexPatent];
        break;

      case "Rebaixamento":
        newIndexPatent = patentPromotedIndex - 1;
        newPatent = info.patents.includes(subordinate.patent) ? info.patents[newIndexPatent] : info.paidPositions[newIndexPatent];
        break;

      case "Demissão":
        newPatent = "Civil";
        break;

      case "Advertência":
        newPatent = null;
        break;

      case "Contrato":
        newPatent = patentContract;
        break;

      default:
        return res.status(400).json({ msg: "Tipo de operação não reconhecido." });
    }

    return {
      isSuperior: true,
      newPatent: newPatent
    };
  } else {
    return {
      isSuperior: false,
      newPatent: newPatent
    };
  }
};

//Cria um novo usuário no system
const register = async (nick, patent) => {
  try {
    const passwordConf = `${process.env.USER_PASS_REGISTER}`
    const nickname = await User.findOne({ nickname: nick.trim() });

    if (nickname && (nickname.status === "Exonerado" || nickname.status === "Banido")) {
      return {
        info: "Ops! Este usuário encontra-se banido ou exonerado.",
        status: false
      };
    } else if (nickname && (nickname.status === "Ativo" || nickname.status === "Pendente")) {
      return {
        info: "Ops! Este usuário encontra-se no quadro de funcionários da DOP",
        status: false
      };
    } else {
      const saltHash = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(passwordConf, saltHash);

      const newUserdb = {
        nickname: nick.trim(),
        password: passwordHash,
        patent: patent,
        classes: "Curso Inicial [C.I]",
        teans: 'System',
        status: 'Pendente',
        tag: 'Vazio',
        warnings: 0,
        medals: 0,
        userType: 'User',
      };

      const createUser = await User.create(newUserdb);
      return createUser
        ? {
          info: "Usuário cadastrado com sucesso.",
          status: true
        }
        : {
          info: "Houve um erro, tente novamente mais tarde",
          status: false
        };
    }
  } catch (error) {
    console.error("Erro ao registrar", error);
    return {
      info: "Erro ao efetuar cadastro",
      status: false
    };
  }
}

//Atualiza conta do usuário caso ela exista na postagem de algum requerimento
const RegisterContExist = async (nickname, patent, classes, sale) => {
  try {
    console.log('Iniciando processo de registro...');
    const passwordConf = `${process.env.USER_PASS_REGISTER}`
    console.log('Buscando usuário com nickname:', nickname);
    const cont = await User.findOne({ nickname: nickname });

    if (!cont) {
      console.log('Usuário não encontrado.');
      return {
        info: `Usuário não encontrado.`,
        status: false
      };

    } else {
      console.log('Usuário encontrado:', cont);

      if (cont.status === "Banido" || cont.status === "Exonerado") {
        console.log('Usuário está banido, exonerado ou é funcionário ativo da DOP.');
        return {
          info: `Esse usuário encontra-se banido, exonerado ou no quadro de funcionários ativos da DOP.`,
          status: false
        };
      } else if(cont.patent !== "Civil" && !sale){
        console.log('Usuário está banido, exonerado ou é funcionário ativo da DOP.');
        return {
          info: `Esse usuário encontra-se banido, exonerado ou no quadro de funcionários ativos da DOP.`,
          status: false
        };
      } else {

        const saltHash = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(passwordConf, saltHash);
  
        cont.nickname = cont.nickname;
        cont.classes = classes.length > 0 ? cont.classes : classes;
        cont.teans = "System";
        cont.patent = patent;
        cont.status = "Pendente";
        cont.tokenActive = "";
        cont.tag = "Vazio";
        cont.warnings = 0;
        cont.medals = 0;
        cont.password = passwordHash;
        cont.userType = "User";
        await cont.save();
  
        console.log('Usuário atualizado com sucesso.');
        return {
          info: 'Usuário atualizado com sucesso.',
          status: true
        };

      }

    }

  } catch (error) {
    console.error('Não foi possível atualizar o usuário.', error);
    return {
      info: 'Não foi possível atualizar o usuário.',
      status: false
    };
  }
}

const getInfos = async () => {
  const docs = await DocsSystem.countDocuments();
  const users = await User.countDocuments({status:{$in:['Ativo', 'Pendente'] }});
  const usersTotal = await User.countDocuments();
  const teams = await Teams.countDocuments();

  return {
    docs,
    users,
    usersTotal,
    teams,
  }
}

const isTokenInvalide = async (user, token) => {
  const userdb = await User.findOne({ nickname: user });
  if (!userdb.tokenIsNotValide) {
    userdb.tokenIsNotValide = [];
  }
  userdb.tokenActive = ""
  userdb.tokenIsNotValide.push(token);
  await userdb.save();
  return;
};

const clearTokens = async () => {
  try {
      await User.updateMany({}, { $set: { tokenActive: null, tokenIsNotValide: [] } });
      console.log("Tokens limpos com sucesso.");
  } catch (error) {
      console.error("Erro ao limpar os tokens:", error);
  }
};




module.exports = {
  connectHabbo,
  createLogger,
  tokenActiveDb,
  isDiretor,
  register,
  RegisterContExist,
  isSuperior,
  getInfos

};