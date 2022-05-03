import prisma from "../src/database.js";

async function seed() {
  //upsert = update/insert
  //melhor que create por que pode dar conflito em campos unicos
  await prisma.category.upsert({
    where: { name: "P1" },
    update: {},
    create: {
      name: "P1",
    },
  });
  await prisma.term.upsert({
    where: { number: 1 },
    update: {},
    create: {
      number: 1,
    },
  });
  await prisma.teacher.upsert({
    where: { name: "Dina" },
    update: {},
    create: {
      name: "Dina",
    },
  });
  await prisma.discipline.upsert({
    where: { name: "P1" },
    update: {},
    create: {
      name: "CSS",
      termId: 1,
    },
  });
  await prisma.teacherDiscipline.upsert({
    where: { id: 1 },
    update: {},
    create: {
      disciplineId: 1,
      teacherId: 1,
    },
  });
}

seed()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export default seed;
