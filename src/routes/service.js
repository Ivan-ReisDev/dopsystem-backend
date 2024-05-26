const router = require('express').Router();
const authGuard = require('../Middleware/authGuard.js')
const { getcurrentUser } = require('../controllers/userController');


const serviceControllerUser = require('../controllers/userController.js')
const serviceControllerTeams = require('../controllers/teamsController.js');
const serviceControllerDocs = require('../controllers/DocsController.js')
const serviceControllerRequirements = require('../controllers/Requirements.js')
const serviceControllerSystem = require('../controllers/systemController.js');
const serviceControllerLogger = require('../controllers/logsController.js');
const serviceControllerClasse = require('../controllers/ClassesController.js')
const serviceControllerRh = require("../controllers/RhController.js")


router.route('/register').post((req, res) => serviceControllerUser.register(req, res))
router.route('/login').post((req, res) => serviceControllerUser.login(req, res))
router.route('/logout').get(authGuard, getcurrentUser, (req, res) => serviceControllerUser.logoutPass(req, res))
router.route('/all/users').get(authGuard, (req, res) => serviceControllerUser.getAll(req, res))
router.route('/user/delete/:userId').delete(authGuard, getcurrentUser,(req, res) => serviceControllerUser.deleteUsers(req, res))
router.route('/users/update').put( (req, res) => serviceControllerUser.updateUser(req, res))
router.route('/profile').get(authGuard, getcurrentUser, (req, res) => serviceControllerUser.getAll(req, res));
router.route('/profile/pages').get(authGuard,(req, res) => serviceControllerUser.getAll(req, res));
router.route('/search').get((req, res) => serviceControllerUser.searchUser(req, res))

router.route('/teams/create').post((req, res) => serviceControllerTeams.createTeams(req, res));
router.route('/teams/update/').put((req, res) => serviceControllerTeams.updateTeams(req, res))
router.route('/searchTeams').get((req, res) => serviceControllerTeams.searchTeams(req, res))
router.route('/teams/all').get((req, res) => serviceControllerTeams.getAllTeams(req, res))
router.route('/teams/delete').delete((req, res) => serviceControllerTeams.deleteTeams(req, res))
router.route('/teams/info').get((req, res) => serviceControllerTeams.returnInfoTeams(req, res));
router.route('/teams/add').put( (req, res) => serviceControllerTeams.addUserTeams(req, res))
router.route('/teams/remove').put( (req, res) => serviceControllerTeams.RemoveUserTeams(req, res))

router.route('/create/docs').post((req, res) => serviceControllerDocs.createDocs(req, res));
router.route('/all/docs').get((req, res) => serviceControllerDocs.getAllDocs(req, res))
router.route('/update/docs').put((req, res) => serviceControllerDocs.updateDocs(req, res))
router.route('/delete/docs').delete((req, res) => serviceControllerDocs.deleteDocs(req, res))


router.route('/all/info').get((req, res) => serviceControllerSystem.getInfoSystem(req, res))
router.route('/create/info').post((req, res) => serviceControllerSystem.createInfo(req, res));

router.route('/post/requirement/promoted').post((req, res) => serviceControllerRequirements.createRequirements(req, res));
router.route('/search/requeriments').get((req, res) => serviceControllerRequirements.searchRequeriments(req, res))
router.route('/post/requirement/relegation').post((req, res) => serviceControllerRequirements.createRequirementsRelegation(req, res));
router.route('/post/requirement/warning').post((req, res) => serviceControllerRequirements.createRequirementsWarning(req, res));
router.route('/post/requirement/resignation').post((req, res) => serviceControllerRequirements.createRequirementsResignation(req, res));
router.route('/post/requeriments/contract').post((req, res) => serviceControllerRequirements.createContract(req, res))
router.route('/post/requeriments/sales').post((req, res) => serviceControllerRequirements.createSales(req, res))
router.route('/put/requirement/resignation').put( (req, res) => serviceControllerRequirements.ResignationUpdateUser(req, res))
router.route('/search/requeriments/promoteds').get((req, res) => serviceControllerRequirements.getAllRequirementsPromoteds(req, res))


//classes 
router.route('/create/classe').post((req, res) => serviceControllerClasse.createClasse(req, res));
router.route('/create/classe/requirement').post((req, res) => serviceControllerClasse.postClasse(req, res));
router.route('/create/ci/requirement').post((req, res) => serviceControllerClasse.postCI(req, res));
router.route('/update/classe').put((req, res) => serviceControllerClasse.updateClasse(req, res));
router.route('/get/classe').get((req, res) => serviceControllerClasse.getClasses(req, res));

//Recursos Humanos 
router.route('/update/status').put((req, res) => serviceControllerRh.editRequeriment(req, res));



//Loguer 
router.route('/loggers').get(authGuard,(req, res) => serviceControllerLogger.getAllLogs(req, res))




module.exports = router