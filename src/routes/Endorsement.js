const router = require('express').Router();
const authGuard = require('../Middleware/authGuard.js')

const serviceControllerEndorsement = require("../controllers/endorsementController.js");


router.route('/endorsement').post(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerEndorsement.createAval(req, res));
router.route('/endorsement/status').put(authGuard(['Admin', 'Diretor','Recursos Humanos']),(req, res) => serviceControllerEndorsement.editAval(req, res));
router.route('/endorsement/delete').delete(authGuard(['Admin', 'Diretor']),(req, res) => serviceControllerEndorsement.deleteAval(req, res));
router.route('/endorsement/').get(authGuard(['Admin', 'Diretor', 'Recursos Humanos']),(req, res) => serviceControllerEndorsement.getAval(req, res));

module.exports = router



