import { Router } from "express";
import categoryRouter from "./categoryRouter.js";
import testRouter from "./testRouter.js";
import userRouter from "./userRouter.js";
import teacherRouter from "./teacherRouter.js";
import disciplineRouter from "./disciplineRouter.js";

const router = Router();
router.use(userRouter);
router.use(testRouter);
router.use(categoryRouter);
router.use(teacherRouter);
router.use(disciplineRouter);
export default router;
