import { User } from "../Models/useModel.js";
import { InfoSystem } from "../Models/systemModel.js";
import { Utils } from "../utils/UserUtils.js";
const utils = new Utils();

export default class ServiceControllerSystem {

  async createInfo(req, res) {
    try {
      const { name, patents, paidPositions, teams } = req.body;
      const idUser = req.idUser;
      const nickname = await User.findOne({ _id: idUser });

      if (nickname && nickname.userType !== "Admin") {
        return res.status(422).json({ error: 'Ops! Você não é um administrador.' })
      }

      if (!name || !patents || !paidPositions || !teams) {
        return res.status(422).json({ error: 'Preencha todos os campos' })
      }

      const newInfo = {
        name,
        patents,
        paidPositions,
        teams,
      }

      const createInfo = await InfoSystem.create(newInfo)

      if (!createInfo) {
        return res.status(422).json({ error: 'Ops! Parece que houve um erro, tente novamente mais tarde.' })
      }

      res.status(201).json({ msg: 'Equipe criada com sucesso.' })

    } catch (error) {
      console.error('Erro ao registrar', error);
      res.status(500).json({ msg: 'Erro ao cadastrar equipe.' })
    }
  };

  async getInfoSystem(req, res) {
    try {
      const info = await utils.getInfos()
      const systemInfo = await InfoSystem.find();
      return res.json(systemInfo)
    } catch (error) {

      console.error('Informações não encontradas', error);
      res.status(500).json({ msg: 'Informações não encontradas' })
    }
  };

  async getInfoSystemDpanel(req, res) {
    try {
      const info = await utils.getInfos()
      const systemInfo = await InfoSystem.find();
      return res.json({ info, systemInfo })

    } catch (error) {

      console.error('Informações não encontradas', error);
      res.status(500).json({ msg: 'Informações não encontradas' })
    }
  };

  async updateInfos(req, res) {
    try {
      const { destaque1, destaque2, destaque3, destaque4 } = req.body;
      const userAdmin = await User.findById(req.idUser);
      const system = await InfoSystem.findOne()

      if (!userAdmin) {
        return res.status(404).json({ error: 'Ops! Usuário não encontrado.' });
      }

      if (userAdmin.userType !== "Admin") {
        return res.status(403).json({ msg: 'Ops! Parece que você não é um administrador.' });

      }

      system.destaques1 = destaque1
      system.destaques2 = destaque2
      system.destaques3 = destaque3
      system.destaques4 = destaque4

      await system.save();

      return res.status(200).json({ msg: `Informações atualizadas com sucesso.` });


    } catch (error) {
      console.error('Ops! Não foi possível atualizar o documento.', error);
      res.status(500).json({ msg: 'Ops! Não foi possível atualizar o documento.' });
    }


  };

  async searchUserPatent(req, res) {
    try {
      const { patent, nickname } = req.query; // Extrair patent e nickname de req.query
      const systemDb = await InfoSystem.find();
      const selectInfo = systemDb[0];

      if (selectInfo.patents.includes(patent) || selectInfo.paidPositions.includes(patent)) {
        let users = await User.find({
          patent: patent,
          $or: [
            { status: "Ativo" },
            { status: "Pendente" } // Substitua "OutroStatus" pelo outro status que deseja incluir
          ]
        });

        if (nickname) {
          users = users.filter(user => user.nickname.includes(nickname));
        }

        return res.json(users);
      }

      return res.status(401).json({ error: 'Patente não encontrada' });

    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  };
}
