import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import portfolioRouter from "./portfolio";
import uploadRouter from "./upload";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/portfolio", portfolioRouter);
router.use("/upload", uploadRouter);

export default router;
