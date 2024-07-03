const router = require('express').Router();
const authGuard = require('../Middleware/authGuard.js')
const serviceControllerRh = require("../controllers/RhController.js")



//Recursos Humanos 
router.route('/update/status').put(authGuard(['Admin', 'Diretor', 'Recursos Humanos']),(req, res) => serviceControllerRh.editRequeriment(req, res));
router.route('/delete/status').delete(authGuard(['Admin', 'Diretor', 'Recursos Humanos']),(req, res) => serviceControllerRh.deleteRequeriments(req, res))

module.exports = router



