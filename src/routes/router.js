import { Router } from "express";
import ClasseRouter from "./ClasseRouter.js";
import DocsRouter from "./DocsRouter.js";
import EndorsementRouter from "./EndorsementRouter.js";
import LoggerRouter from "./LoggerRouter.js";
import PublicationRouter from "./PublicationRouter.js";
import RequirementsRouter from "./RequirementsRouter.js";
import RhRouter from "./RhRouter.js";
import SystemRouter from "./SystemRouter.js";
import TeamsRouter from "./TeamsRouter.js";
import UserRouter from "./UserRouter.js";
import ImagesRouter from "./ImagesRouter.js";

const AppRoutes = Router();

AppRoutes.use("/", ClasseRouter, DocsRouter, EndorsementRouter, LoggerRouter, PublicationRouter, RequirementsRouter, RhRouter, SystemRouter, TeamsRouter, UserRouter, ImagesRouter);

export default AppRoutes;