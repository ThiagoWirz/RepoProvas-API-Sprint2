import app from "../src/app.js";
import supertest from "supertest";
import userFactory from "./factories/userFactory.js";
import prisma from "../src/database.js";
import userBodyFactory from "./factories/userBodyFactory.js";

describe("Post /sign-up", () => {
  beforeEach(truncateUsers);

  afterAll(disconnectPrimas);

  it("Should return 201 when create user", async () => {
    const body = userBodyFactory();
    const result = await supertest(app).post("/sign-up").send(body);
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    expect(result.status).toEqual(201);
    expect(user).not.toBeNull();
  });

  it("should return 409 given duplicate email", async () => {
    const body = userBodyFactory();

    await userFactory(body);

    const result = await supertest(app).post("/sign-up").send(body);
    const users = await prisma.user.findMany({
      where: {
        email: body.email,
      },
    });

    expect(result.status).toEqual(409);
    expect(users.length).toEqual(1);
  });
});

describe("Post, /sign-in", () => {
  beforeEach(truncateUsers);

  afterAll(disconnectPrimas);
  it("should answer with status 200 when given valid credentials", async () => {
    const body = userBodyFactory();

    await userFactory(body);

    const result = await supertest(app).post("/sign-in").send(body);

    expect(result.status).toEqual(200);
    expect(typeof result.body.token).toEqual("string");
    expect(result.body.token.length).toBeGreaterThan(0);
  });

  it("should answer with status 401 when given invalid credentials", async () => {
    const user = userBodyFactory();
    await userFactory(user);

    const result = await supertest(app)
      .post("/sign-in")
      .send({ ...user, password: "miajuda" });

    expect(result.status).toEqual(401);
  });
});

async function truncateUsers() {
  await prisma.$executeRaw`TRUNCATE TABLE users`;
}

async function disconnectPrimas() {
  await prisma.$disconnect();
}
