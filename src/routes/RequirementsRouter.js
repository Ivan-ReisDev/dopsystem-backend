import express from "express"
import ServiceControllerRequirements from "../controllers/Requirements.js";
import { authGuard } from "../Middleware/authGuard.js";

const RequirementsRouter = express.Router();
const serviceControllerRequirements = new ServiceControllerRequirements();

RequirementsRouter.route('/post/requirement/promoted').post(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerRequirements.createRequirements(req, res));
RequirementsRouter.route('/search/requeriments').get(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerRequirements.searchRequeriments(req, res))
RequirementsRouter.route('/post/requirement/relegation').post(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerRequirements.createRequirementsRelegation(req, res));
RequirementsRouter.route('/post/requirement/warning').post(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerRequirements.createRequirementsWarning(req, res));
RequirementsRouter.route('/post/requirement/resignation').post(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerRequirements.createRequirementsResignation(req, res));
RequirementsRouter.route('/post/requeriments/contract').post(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerRequirements.createContract(req, res))
RequirementsRouter.route('/post/requeriments/sales').post(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerRequirements.createSales(req, res))
RequirementsRouter.route('/put/requirement/resignation').put( authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerRequirements.ResignationUpdateUser(req, res))
RequirementsRouter.route('/search/requeriments/promoteds').get(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerRequirements.getAllRequirementsPromoteds(req, res))
RequirementsRouter.route('/search/requeriments/teams').get(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerRequirements.getAllRequirementsTeams(req, res))

export default RequirementsRouter;