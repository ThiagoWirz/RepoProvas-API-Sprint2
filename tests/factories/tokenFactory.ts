import supertest from "supertest";
import app from "../../src/app.js";

export default async function tokenFactory(user) {
  const response: any = await supertest(app).post("/sign-in").send(user);
  return response.text;
}
