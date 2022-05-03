import categoryRepository from "../repositories/categoryRepository.js";
import disciplineRepository from "../repositories/disciplineRepository.js";
import teacherRepository from "../repositories/teacherRepository.js";
import testRepository from "../repositories/testRepository.js";
import { notFoundError, badRequest } from "../utils/errorUtils.js";

interface Filter {
  groupBy: "disciplines" | "teachers";
}

export type CreateTestData = {
  name: string;
  pdfUrl: string;
  categoryId: number;
  teacherDisciplineId: number;
};

async function find(filter: Filter) {
  if (filter.groupBy === "disciplines") {
    return testRepository.getTestsByDiscipline();
  } else if (filter.groupBy === "teachers") {
    return testRepository.getTestsByTeachers();
  }
}

async function add(
  name: string,
  pdfUrl: string,
  categoryName: string,
  disciplineName: string,
  teacherName: string
) {
  const category = await categoryRepository.findByName(categoryName);
  if (!category) throw notFoundError("category not found");

  const discipline = await disciplineRepository.findByName(disciplineName);
  if (!discipline) throw notFoundError("discipline not found");

  const teacher = await teacherRepository.findByName(teacherName);
  if (!teacher) throw notFoundError("teacher not found");

  const teacherDiscipline = await teacherRepository.findTeacherDiscipline(
    teacher.id,
    discipline.id
  );
  if (!teacherDiscipline)
    throw badRequest("Teacher do not teach this discipline");

  const data = {
    name,
    pdfUrl,
    categoryId: category.id,
    teacherDisciplineId: teacherDiscipline.id,
  };

  await testRepository.add(data);
}

async function updateViews(id: number) {
  await testRepository.updateViewsCount(id);
}

export default {
  find,
  add,
  updateViews,
};
