const router = require('express').Router();
const authGuard = require('../Middleware/authGuard.js')
const serviceControllerDocs = require('../controllers/DocsController.js');


router.route('/create/docs').post(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerDocs.createDocs(req, res));
router.route('/all/docs').get(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerDocs.getAllDocs(req, res))
router.route('/update/docs').put(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerDocs.updateDocs(req, res))
router.route('/delete/docs').delete(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerDocs.deleteDocs(req, res))
router.route('/doc/search').get(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerDocs.searchDoc(req, res));
router.route('/doc').get(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerDocs.searchDocCompleted(req, res));

module.exports = router
