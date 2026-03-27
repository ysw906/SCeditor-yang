import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import portfolioRouter from "./portfolio";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/portfolio", portfolioRouter);

export default router;
