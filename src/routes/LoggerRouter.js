
import express from "express"
import ServiceControllerLogger from "../controllers/logsController.js";
import { authGuard } from "../Middleware/authGuard.js";

const LoggerRouter = express.Router();
const serviceControllerLogger = new ServiceControllerLogger();

LoggerRouter.route('/loggers').get(authGuard(['Admin']),(req, res) => serviceControllerLogger.getAllLogs(req, res))
//LoggerRouter.route('/loggers').delete((req, res) => serviceControllerLogger.deleteLogs(req, res))import express from "express"

export default LoggerRouter;