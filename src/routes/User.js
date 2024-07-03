const router = require('express').Router();
const authGuard = require('../Middleware/authGuard.js')
const { getcurrentUser } = require('../controllers/userController');
const serviceControllerUser = require('../controllers/userController.js');

router.route('/all/users').get(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']), (req, res) => serviceControllerUser.getAll(req, res))
router.route('/user/delete/:userId').delete(authGuard(['Admin']), getcurrentUser,(req, res) => serviceControllerUser.deleteUsers(req, res))
router.route('/profile').get(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']), getcurrentUser, (req, res) => serviceControllerUser.getAll(req, res));
router.route('/search').get(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerUser.searchUser(req, res));
router.route('/admin/update').put(authGuard(['Admin']),(req, res) => serviceControllerUser.updateUserAdmin(req, res))
router.route('/update/tag').put(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerUser.createTag(req, res))

module.exports = router
