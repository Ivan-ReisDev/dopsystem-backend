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
router.route('/users/update').put((req, res) => serviceControllerUser.updateUser(req, res))
router.route('/profile').get(authGuard, getcurrentUser, (req, res) => serviceControllerUser.getAll(req, res));
router.route('/search').get(authGuard,(req, res) => serviceControllerUser.searchUser(req, res));
router.route('/admin/update').put(authGuard,(req, res) => serviceControllerUser.updateUserAdmin(req, res))
router.route('/update/tag').put(authGuard,(req, res) => serviceControllerUser.createTag(req, res))

router.route('/teams/create').post(authGuard,(req, res) => serviceControllerTeams.createTeams(req, res));
router.route('/teams/update/').put(authGuard,(req, res) => serviceControllerTeams.updateTeams(req, res))
router.route('/searchTeams').get(authGuard,(req, res) => serviceControllerTeams.searchTeams(req, res))
router.route('/teams/all').get(authGuard,(req, res) => serviceControllerTeams.getAllTeams(req, res))
router.route('/teams/delete').delete(authGuard,(req, res) => serviceControllerTeams.deleteTeams(req, res))
router.route('/teams/info').get(authGuard,(req, res) => serviceControllerTeams.returnInfoTeams(req, res));
router.route('/teams/add').put(authGuard,(req, res) => serviceControllerTeams.addUserTeams(req, res))
router.route('/teams/remove').put(authGuard,(req, res) => serviceControllerTeams.RemoveUserTeams(req, res))

router.route('/create/docs').post(authGuard,(req, res) => serviceControllerDocs.createDocs(req, res));
router.route('/all/docs').get(authGuard,(req, res) => serviceControllerDocs.getAllDocs(req, res))
router.route('/update/docs').put(authGuard,(req, res) => serviceControllerDocs.updateDocs(req, res))
router.route('/delete/docs').delete(authGuard,(req, res) => serviceControllerDocs.deleteDocs(req, res))
router.route('/doc/search').get((req, res) => serviceControllerDocs.searchDoc(req, res));


router.route('/all/info').get(authGuard,(req, res) => serviceControllerSystem.getInfoSystem(req, res))
router.route('/create/info').post(authGuard,(req, res) => serviceControllerSystem.createInfo(req, res));

router.route('/post/requirement/promoted').post(authGuard,(req, res) => serviceControllerRequirements.createRequirements(req, res));
router.route('/search/requeriments').get(authGuard,(req, res) => serviceControllerRequirements.searchRequeriments(req, res))
router.route('/post/requirement/relegation').post(authGuard,(req, res) => serviceControllerRequirements.createRequirementsRelegation(req, res));
router.route('/post/requirement/warning').post(authGuard,(req, res) => serviceControllerRequirements.createRequirementsWarning(req, res));
router.route('/post/requirement/resignation').post(authGuard,(req, res) => serviceControllerRequirements.createRequirementsResignation(req, res));
router.route('/post/requeriments/contract').post(authGuard,(req, res) => serviceControllerRequirements.createContract(req, res))
router.route('/post/requeriments/sales').post(authGuard,(req, res) => serviceControllerRequirements.createSales(req, res))
router.route('/put/requirement/resignation').put( authGuard,(req, res) => serviceControllerRequirements.ResignationUpdateUser(req, res))
router.route('/search/requeriments/promoteds').get(authGuard,(req, res) => serviceControllerRequirements.getAllRequirementsPromoteds(req, res))


//classes 
router.route('/create/classe').post(authGuard,(req, res) => serviceControllerClasse.createClasse(req, res));
router.route('/create/classe/requirement').post(authGuard,(req, res) => serviceControllerClasse.postClasse(req, res));
router.route('/create/ci/requirement').post(authGuard,(req, res) => serviceControllerClasse.postCI(req, res));
router.route('/update/classe').put(authGuard,(req, res) => serviceControllerClasse.updateClasse(req, res));
router.route('/get/classe').get(authGuard,(req, res) => serviceControllerClasse.getClasses(req, res));

//Recursos Humanos 
router.route('/update/status').put(authGuard,(req, res) => serviceControllerRh.editRequeriment(req, res));
router.route('/delete/status').delete(authGuard,(req, res) => serviceControllerRh.deleteRequeriments(req, res))
//Loguer 
router.route('/loggers').get(authGuard,(req, res) => serviceControllerLogger.getAllLogs(req, res))





module.exports = router