import { SignUpController } from "./signup";

describe("SignUpController", () => {
  test("should return 400 if no name is informed", () => {
    const sut = new SignUpController();

    const input = {
      email: "teste@gmail.com",
      password: "123",
      passwordConfirmation: "123",
    };

    const response = sut.handle(input);

    expect(response.statusCode).toBe(400);
  });
});
