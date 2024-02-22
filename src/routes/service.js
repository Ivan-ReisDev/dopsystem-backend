const router = require('express').Router();
const authGuard = require('../Middleware/authGuard.js')
const { getcurrentUser } = require('../controllers/userController');


const serviceControllerUser = require('../controllers/userController.js')
const serviceControllerTeams = require('../controllers/teamsController.js')

router.route('/register').post(authGuard, getcurrentUser,(req, res) => serviceControllerUser.register(req, res))
router.route('/login').post((req, res) => serviceControllerUser.login(req, res))
router.route('/all/users').get((req, res) => serviceControllerUser.getAll(req, res))
router.route('/user/delete/:userId').delete(authGuard, getcurrentUser,(req, res) => serviceControllerUser.deleteUsers(req, res))
router.route('/users/update').put( (req, res) => serviceControllerUser.updateUser(req, res))
router.route('/profile').get(authGuard, getcurrentUser, (req, res) => serviceControllerUser.getAll(req, res))


router.route('/teams/create').post((req, res) => serviceControllerTeams.createTeams(req, res))
router.route('/teams/update/:teamsId').put((req, res) => serviceControllerTeams.updateTeams(req, res))
router.route('/searchTeams').get((req, res) => serviceControllerTeams.searchTeams(req, res))
router.route('/teams/delete/:teamsId').delete((req, res) => serviceControllerTeams.deleteTeams(req, res))

module.exports = router