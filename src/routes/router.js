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

const AppRoutes = Router();

AppRoutes.use("/classe", ClasseRouter);
AppRoutes.use("/document", DocsRouter);
AppRoutes.use("/endorsement", EndorsementRouter);
AppRoutes.use("/logger", LoggerRouter)
AppRoutes.use("/publication", PublicationRouter);
AppRoutes.use("/requirements", RequirementsRouter);
AppRoutes.use("/rh", RhRouter)
AppRoutes.use("/system", SystemRouter);
AppRoutes.use("/teams", TeamsRouter);
AppRoutes.use("/user", UserRouter)

export default AppRoutes;