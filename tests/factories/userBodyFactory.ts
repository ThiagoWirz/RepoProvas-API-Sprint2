import { faker } from "@faker-js/faker";
import { CreateUserData } from "../../src/services/userService";

export default function userBodyFactory(): CreateUserData {
  const body = {
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
  return body;
}
