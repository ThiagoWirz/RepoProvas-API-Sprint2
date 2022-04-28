import teacherRepository from "../repositories/teacherRepository.js";

async function getTeachersNames() {
  return teacherRepository.getNames();
}

export default {
  getTeachersNames,
};
