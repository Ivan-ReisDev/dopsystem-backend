const router = require('express').Router();
const authGuard = require('../Middleware/authGuard.js');

const serviceControllerRequirements = require('../controllers/Requirements.js')

router.route('/post/requirement/promoted').post(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerRequirements.createRequirements(req, res));
router.route('/search/requeriments').get(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerRequirements.searchRequeriments(req, res))
router.route('/post/requirement/relegation').post(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerRequirements.createRequirementsRelegation(req, res));
router.route('/post/requirement/warning').post(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerRequirements.createRequirementsWarning(req, res));
router.route('/post/requirement/resignation').post(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerRequirements.createRequirementsResignation(req, res));
router.route('/post/requeriments/contract').post(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerRequirements.createContract(req, res))
router.route('/post/requeriments/sales').post(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerRequirements.createSales(req, res))
router.route('/put/requirement/resignation').put( authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerRequirements.ResignationUpdateUser(req, res))
router.route('/search/requeriments/promoteds').get(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerRequirements.getAllRequirementsPromoteds(req, res))
router.route('/search/requeriments/teams').get(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerRequirements.getAllRequirementsTeams(req, res))


module.exports = router



