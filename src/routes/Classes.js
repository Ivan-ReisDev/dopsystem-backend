const router = require('express').Router();
const authGuard = require('../Middleware/authGuard.js')

const serviceControllerClasse = require('../controllers/ClassesController.js')

//classes 
router.route('/create/classe').post(authGuard(['Admin']),(req, res) => serviceControllerClasse.createClasse(req, res));
router.route('/delete/classe').delete(authGuard(['Admin']),(req, res) => serviceControllerClasse.deleteClasse(req, res));
router.route('/create/classe/requirement').post(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerClasse.postClasse(req, res));
router.route('/create/ci/requirement').post(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerClasse.postCI(req, res));
router.route('/update/classe').put(authGuard(['Admin']),(req, res) => serviceControllerClasse.updateClasse(req, res));
router.route('/get/classe').get(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerClasse.getClasses(req, res));

module.exports = router



