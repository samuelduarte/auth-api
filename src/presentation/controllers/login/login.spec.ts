import { MissingParamError } from "../../error";
import { BadRequest } from "../../helpers/http-helper";
import { LoginController } from "./login";

describe("LoginController", () => {
  const makeLoginController = (): LoginController => {
    return new LoginController();
  };
  test("Should return error when is no passed email", async () => {
    const sut = makeLoginController();
    const result = await sut.handle({
      body: {
        password: "123",
      },
    });

    expect(result).toEqual(BadRequest(new MissingParamError("email")));
  });

  test("Should return error when is no passed password", async () => {
    const sut = makeLoginController();
    const result = await sut.handle({
      body: {
        email: "123",
      },
    });

    expect(result).toEqual(BadRequest(new MissingParamError("password")));
  });
});
