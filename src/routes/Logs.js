const router = require('express').Router();
const authGuard = require('../Middleware/authGuard.js')
const serviceControllerLogger = require('../controllers/logsController.js');


router.route('/loggers').get(authGuard(['Admin']),(req, res) => serviceControllerLogger.getAllLogs(req, res))



module.exports = router



