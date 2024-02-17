const router = require('express').Router();
const authGuard = require('../Middleware/authGuard.js')
const { getcurrentUser } = require('../controllers/userController');


const serviceControllerUser = require('../controllers/userController.js')

router.route('/register').post((req, res) => serviceControllerUser.register(req, res))
router.route('/login').post((req, res) => serviceControllerUser.login(req, res))
router.route('/all/users').get((req, res) => serviceControllerUser.getAll(req, res))
router.route('/user/delete/:userId').delete((req, res) => serviceControllerUser.deleteUsers(req, res))
router.route('/users/update').put((req, res) => serviceControllerUser.updateUser(req, res))


module.exports = router