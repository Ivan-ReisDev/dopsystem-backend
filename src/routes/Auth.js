const router = require('express').Router();
const serviceControllerUser = require('../controllers/userController.js');


router.route('/register').post((req, res) => serviceControllerUser.register(req, res))
router.route('/login').post((req, res) => serviceControllerUser.login(req, res))
router.route('/users/update').put((req, res) => serviceControllerUser.updateUser(req, res))
router.route('/logout').get((req, res) => serviceControllerUser.logoutPass(req, res));


module.exports = router
