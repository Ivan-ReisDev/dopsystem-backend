const router = require("express").Router();

const AuthRouter = require("./Auth");
const ClassesRouter = require("./Classes");
const DocsRouter = require("./Docs");
const EndorsementRouter = require("./Endorsement");
const InfoRouter = require("./Info");
const LogsRouter = require("./Logs");
const PublicationRouter = require("./Publications");
const RequirementsRouter = require("./Requirements");
const RhRouter = require("./Rh");
const TeamsRouter = require("./Teams");
const UserRouter = require("./User")

router.use("/", AuthRouter);
router.use("/", ClassesRouter);
router.use("/", DocsRouter);
router.use("/", EndorsementRouter);
router.use("/", InfoRouter);
router.use("/", PublicationRouter);
router.use("/", LogsRouter);
router.use("/", RequirementsRouter);
router.use("/", RhRouter);
router.use("/", TeamsRouter);
router.use("/", UserRouter);

module.exports = router;