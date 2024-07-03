const router = require('express').Router();
const authGuard = require('../Middleware/authGuard.js')

const serviceControllerTeams = require('../controllers/teamsController.js');

router.route('/teams/create').post(authGuard(['Admin']),(req, res) => serviceControllerTeams.createTeams(req, res));
router.route('/teams/update').put(authGuard(['Admin']),(req, res) => serviceControllerTeams.updateTeams(req, res))
router.route('/searchTeams').get(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerTeams.searchTeams(req, res))
router.route('/teams/all').get(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerTeams.getAllTeams(req, res))
router.route('/teams/delete').delete(authGuard(['Admin']),(req, res) => serviceControllerTeams.deleteTeams(req, res))
router.route('/teams/info').get(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerTeams.returnInfoTeams(req, res));
router.route('/teams/add').put(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerTeams.addUserTeams(req, res))
router.route('/teams/remove').put(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerTeams.RemoveUserTeams(req, res))

module.exports = router