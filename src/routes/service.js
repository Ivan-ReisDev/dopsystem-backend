const router = require('express').Router();
const authGuard = require('../Middleware/authGuard.js')
const { getcurrentUser } = require('../controllers/userController');


const serviceControllerUser = require('../controllers/userController.js')
const serviceControllerTeams = require('../controllers/teamsController.js');
const serviceControllerDocs = require('../controllers/DocsController.js')
const serviceControllerRequirements = require('../controllers/Requirements.js')
const serviceControllerSystem = require('../controllers/systemController.js');


router.route('/register').post((req, res) => serviceControllerUser.register(req, res))
router.route('/login').post((req, res) => serviceControllerUser.login(req, res))
router.route('/logout').get(authGuard, getcurrentUser, (req, res) => serviceControllerUser.logoutPass(req, res))
router.route('/all/users').get((req, res) => serviceControllerUser.getAll(req, res))
router.route('/user/delete/:userId').delete(authGuard, getcurrentUser,(req, res) => serviceControllerUser.deleteUsers(req, res))
router.route('/users/update').put( (req, res) => serviceControllerUser.updateUser(req, res))
router.route('/profile').get(authGuard, getcurrentUser, (req, res) => serviceControllerUser.getAll(req, res));
router.route('/search').get((req, res) => serviceControllerUser.searchUser(req, res))

router.route('/teams/create').post((req, res) => serviceControllerTeams.createTeams(req, res));
router.route('/teams/update/:teamsId').put((req, res) => serviceControllerTeams.updateTeams(req, res))
router.route('/searchTeams').get((req, res) => serviceControllerTeams.searchTeams(req, res))
router.route('/teams/all').get((req, res) => serviceControllerTeams.getAllTeams(req, res))
router.route('/teams/delete/:teamsId').delete((req, res) => serviceControllerTeams.deleteTeams(req, res))

router.route('/create/docs').post((req, res) => serviceControllerDocs.createDocs(req, res));
router.route('/all/docs').get((req, res) => serviceControllerDocs.getAllDocs(req, res))



router.route('/all/info').get((req, res) => serviceControllerSystem.getInfoSystem(req, res))
router.route('/create/info').post((req, res) => serviceControllerSystem.createInfo(req, res));

router.route('/post/requirement/promoted').post((req, res) => serviceControllerRequirements.createRequirements(req, res));
router.route('/search/requeriments').get((req, res) => serviceControllerRequirements.searchRequeriments(req, res))
router.route('/post/requirement/relegation').post((req, res) => serviceControllerRequirements.createRequirementsRelegation(req, res));

module.exports = router