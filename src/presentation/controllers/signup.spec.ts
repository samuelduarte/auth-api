import { MissingParamError } from "../error/missing-param-error";
import { SignUpController } from "./signup";

describe("SignUpController", () => {
  test("should return 400 if no name is informed", () => {
    const sut = new SignUpController();

    const httpRequest = {
      body: {
        email: "teste@gmail.com",
        password: "123",
        passwordConfirmation: "123",
      },
    };

    const response = sut.handle(httpRequest);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(new MissingParamError("name"));
  });

  test("should return 400 if no email is informed", () => {
    const sut = new SignUpController();

    const httpRequest = {
      body: {
        name: "teste",
        password: "123",
        passwordConfirmation: "123",
      },
    };

    const response = sut.handle(httpRequest);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(new MissingParamError("email"));
  });
});
