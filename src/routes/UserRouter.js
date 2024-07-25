import express from "express"
import ServiceControllerUser from "../controllers/userController.js";
import { authGuard } from "../Middleware/authGuard.js";

const UserRouter = express.Router();
const serviceControllerUser = new ServiceControllerUser();

UserRouter.route('/login').post((req, res) => serviceControllerUser.login(req, res))
UserRouter.route('/users/update').put((req, res) => serviceControllerUser.updateUser(req, res))
UserRouter.route('/logout').get(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerUser.logoutPass(req, res))

// Rotas privadas 
UserRouter.route('/all/users').get(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']), (req, res) => serviceControllerUser.getAll(req, res))
UserRouter.route('/user/delete/:userId').delete(authGuard(['Admin']),(req, res) => serviceControllerUser.deleteUsers(req, res))
UserRouter.route('/profile').get(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']), serviceControllerUser.getcurrentUser, (req, res) => serviceControllerUser.getAll(req, res));
UserRouter.route('/search').get(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerUser.searchUser(req, res));
UserRouter.route('/admin/update').put(authGuard(['Admin']),(req, res) => serviceControllerUser.updateUserAdmin(req, res))
UserRouter.route('/update/tag').put(authGuard(['Admin', 'Diretor', 'User', 'Recursos Humanos']),(req, res) => serviceControllerUser.createTag(req, res));
UserRouter.route('/permissions').get(authGuard(['Admin']),(req, res) => serviceControllerUser.permissions(req, res));


export default UserRouter;