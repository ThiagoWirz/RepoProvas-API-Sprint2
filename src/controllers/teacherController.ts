import { Request, Response } from "express";
import teacherService from "../services/teacherService.js";

async function getTeachersNames(req: Request, res: Response) {
  const teachers = await teacherService.getTeachersNames();

  res.status(200).send({ teachers });
}

export default {
  getTeachersNames,
};
