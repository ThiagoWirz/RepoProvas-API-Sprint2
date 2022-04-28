import prisma from "../database.js";

async function getNames() {
  return prisma.teacher.findMany({
    select: {
      name: true,
    },
  });
}

export default {
  getNames,
};
