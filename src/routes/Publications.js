const router = require('express').Router();
const authGuard = require('../Middleware/authGuard.js');
const serviceControllerPublication = require("../controllers/PublicationController.js");


router.route('/create/publication').post(authGuard(['Admin']),(req, res) => serviceControllerPublication.createPublication(req, res));
router.route('/delete/publication').delete(authGuard(['Admin']),(req, res) => serviceControllerPublication.deletePublications(req, res));
router.route('/publication').get(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerPublication.getAllPublications(req, res));

module.exports = router



