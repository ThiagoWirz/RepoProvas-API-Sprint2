// import faker from "faker";
import bcrypt from "bcrypt";
import prisma from "../../src/database.js";

export async function createUser() {
  const user = {
    email: "sauhsuahsuah@email.com",
    password: "123456",
  };

  const insertedUser = await prisma.user.create({
    data: {
      email: user.email,
      password: bcrypt.hashSync(user.password, 10),
    },
  });
  return insertedUser;
}
