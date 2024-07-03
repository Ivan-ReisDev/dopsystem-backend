const router = require('express').Router();
const authGuard = require('../Middleware/authGuard.js')


const serviceControllerSystem = require('../controllers/systemController.js');

//Rota
router.route('/all/info').get(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerSystem.getInfoSystem(req, res))
router.route('/create/info').post(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerSystem.createInfo(req, res));
router.route('/patents').get(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerSystem.searchUserPatent(req, res))



module.exports = router



