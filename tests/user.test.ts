import app from "../src/app.js";
import supertest from "supertest";
import { createUser } from "./factories/userFactory.js";
import prisma from "../src/database.js";

describe("Post /sign-up", () => {
  it("Should return 201 when create user", async () => {
    const user = {
      email: "suahsauhsauh@suahusahsuaaa.com",
      password: "123455",
    };
    const result = await supertest(app).post("/sign-up").send(user);

    expect(result.status).toEqual(201);
  });

  it("should return 409 when create 2 user with same email", async () => {
    const user = await createUser();
    const sameUser = {
      email: user.email,
      password: user.password,
    };

    const result = await supertest(app).post("/sign-up").send(sameUser);

    expect(result.status).toEqual(409);
  });
});

describe("Post, /sign-in", () => {
  it("should answer with status 200 when given valid credentials", async () => {
    const user = {
      email: "teste2@teste.com",
      password: "123456",
    };

    await supertest(app).post("/sign-up").send(user);
    const result = await supertest(app).post("/sign-in").send(user);

    expect(result.status).toEqual(200);
  });

  it("should answer with status 401 when given invalid credentials", async () => {
    const user = {
      email: "teste2@teste.com",
      password: "123456",
    };
    await supertest(app).post("/sign-up").send(user);
    const secondUser = {
      email: "teste2@teste.com",
      password: "111111",
    };

    const result = await supertest(app).post("/sign-in").send(secondUser);

    expect(result.status).toEqual(401);
  });
});
