import express from "express"
import ServiceControllerSystem from "../controllers/systemController.js";
import { authGuard } from "../Middleware/authGuard.js";

const SystemRouter = express.Router();
const serviceControllerSystem = new ServiceControllerSystem();

SystemRouter.route('/all/info').get(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerSystem.getInfoSystem(req, res))
SystemRouter.route('/create/info').post(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerSystem.createInfo(req, res));
SystemRouter.route('/patents').get(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerSystem.searchUserPatent(req, res))
SystemRouter.route('/infos').put(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerSystem.updateInfos(req, res))
SystemRouter.route('/infos').get((req, res) => serviceControllerSystem.getInfoSystemDpanel(req, res))

export default SystemRouter;