import app from "../../src/app.js";
import supertest from "supertest";
import userFactory from "../factories/userFactory.js";
import prisma from "../../src/database.js";
import userBodyFactory from "../factories/userBodyFactory.js";
import tokenFactory from "../factories/tokenFactory.js";
import testBodyFactory from "../factories/testBodyFactory.js";
import seed from "../../prisma/seed.js";
import dotenv from "dotenv";
dotenv.config();

describe("Post /sign-up", () => {
  beforeEach(truncateUsers);

  afterAll(disconnectPrimas);

  it("Should return 201 when create user", async () => {
    console.log(process.env.DATABASE_URL);
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

describe("Route Tests, GET", () => {
  beforeEach(truncateTests);
  beforeEach(truncateUsers);
  afterAll(disconnectPrimas);

  it("should return 401 given invalid token", async () => {
    const response = await supertest(app)
      .get("/tests")
      .send({})
      .set("Authorization", "miajuda");

    expect(response.status).toEqual(401);
  });
  it("should return an object given a valid token", async () => {
    const user = userBodyFactory();
    await userFactory(user);
    const JSONtoken = await tokenFactory(user);
    const { token } = JSON.parse(JSONtoken);
    const response: any = await supertest(app)
      .get("/tests")
      .send({})
      .set("Authorization", token);
    expect(typeof response.body).toEqual("object");
  });
});

describe("Route /tests, POST", () => {
  beforeEach(truncateUsers);
  beforeEach(truncateTests);
  afterAll(disconnectPrimas);
  it("Should return 422 given invalid body", async () => {
    const user = userBodyFactory();
    await userFactory(user);
    const JSONtoken = await tokenFactory(user);
    const { token } = JSON.parse(JSONtoken);
    const body = { teste: "teste" };

    const response = await supertest(app)
      .post("/tests")
      .send(body)
      .set("Authorization", token);

    expect(response.status).toEqual(422);
  });

  it("should return 201 and persists given a valid body", async () => {
    const user = userBodyFactory();
    await userFactory(user);
    const JSONtoken = await tokenFactory(user);
    const { token } = JSON.parse(JSONtoken);
    const test = testBodyFactory();

    const response = await supertest(app)
      .post("/tests")
      .send(test)
      .set("Authorization", token);
    const tests = await prisma.test.findMany({
      where: {
        name: test.name,
      },
    });
    expect(response.status).toEqual(201);
    expect(tests.length).toEqual(1);
  });

  it("should return 404 given invalid category name", async () => {
    const user = userBodyFactory();
    await userFactory(user);
    const JSONtoken = await tokenFactory(user);
    const { token } = JSON.parse(JSONtoken);
    const test = testBodyFactory();

    const response = await supertest(app)
      .post("/tests")
      .send({ ...test, categoryName: "P7" })
      .set("Authorization", token);

    expect(response.status).toEqual(404);
  });
  it("should return 404 given invalid discipline name", async () => {
    const user = userBodyFactory();
    await userFactory(user);
    const JSONtoken = await tokenFactory(user);
    const { token } = JSON.parse(JSONtoken);
    const test = testBodyFactory();

    const response = await supertest(app)
      .post("/tests")
      .send({ ...test, disciplineName: "MIAJUDA" })
      .set("Authorization", token);

    expect(response.status).toEqual(404);
  });
  it("should return 404 given invalid teacher name", async () => {
    const user = userBodyFactory();
    await userFactory(user);
    const JSONtoken = await tokenFactory(user);
    const { token } = JSON.parse(JSONtoken);
    const test = testBodyFactory();

    const response = await supertest(app)
      .post("/tests")
      .send({ ...test, teacherName: "ALOOO" })
      .set("Authorization", token);

    expect(response.status).toEqual(404);
  });
});

describe("ROUTE /tests, PATCH", () => {
  it("should return view count 1", async () => {
    const user = userBodyFactory();
    await userFactory(user);
    const JSONtoken = await tokenFactory(user);
    const { token } = JSON.parse(JSONtoken);
    const data = {
      name: "teste",
      pdfUrl: "http://teste.com",
      categoryId: 1,
      teacherDisciplineId: 1,
    };

    const insertedTest = await prisma.test.create({
      data,
    });

    await supertest(app)
      .patch(`/tests/${insertedTest.id}`)
      .send({})
      .set("Authorization", token);

    const viewTest = await prisma.test.findUnique({
      where: {
        id: insertedTest.id,
      },
    });

    expect(viewTest.views).toEqual(1);
  });
});

async function truncateUsers() {
  await prisma.$executeRaw`TRUNCATE TABLE users`;
}

async function disconnectPrimas() {
  await prisma.$disconnect();
}
async function truncateTests() {
  await prisma.$executeRaw`TRUNCATE TABLE tests`;
}
