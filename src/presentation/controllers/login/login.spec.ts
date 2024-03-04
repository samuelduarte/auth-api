import { Authentication, EmailValidator } from "../login/login-protocols";
import { MissingParamError } from "../../error";
import { BadRequest, unauthorized } from "../../helpers/http-helper";
import { LoginController } from "./login";

describe("LoginController", () => {
  const makeAuthentication = (): Authentication => {
    class AuthenticationStub implements Authentication {
      async auth(email: string, password: string): Promise<string> {
        return new Promise((resolve) => resolve("any_token"));
      }
    }

    return new AuthenticationStub();
  };

  const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
      isValid(email: string): boolean {
        return true;
      }
    }

    return new EmailValidatorStub();
  };

  interface SubTypes {
    sut: LoginController;
    emailValidatorStub: EmailValidator;
    authentication: Authentication;
  }

  const makeSut = (): SubTypes => {
    const authentication = makeAuthentication();
    const emailValidatorStub = makeEmailValidator();
    const sut = new LoginController(emailValidatorStub, authentication);
    return {
      sut,
      emailValidatorStub,
      authentication,
    };
  };
  test("Should return error when is no passed email", async () => {
    const { sut } = makeSut();
    const result = await sut.handle({
      body: {
        password: "123",
      },
    });

    expect(result).toEqual(BadRequest(new MissingParamError("email")));
  });

  test("Should return error when is no passed password", async () => {
    const { sut } = makeSut();
    const result = await sut.handle({
      body: {
        email: "123",
      },
    });

    expect(result).toEqual(BadRequest(new MissingParamError("password")));
  });

  test("Should call validate email", async () => {
    const { sut, emailValidatorStub } = makeSut();
    const emailValidSpy = jest.spyOn(emailValidatorStub, "isValid");

    const result = await sut.handle({
      body: {
        email: "123@gmail.com",
        password: "any_password",
      },
    });
    expect(emailValidSpy).toHaveBeenCalledWith("123@gmail.com");
  });

  test("Should call validate email", async () => {
    const { sut, authentication } = makeSut();
    const authSpy = jest.spyOn(authentication, "auth");

    await sut.handle({
      body: {
        email: "123@gmail.com",
        password: "any_password",
      },
    });
    expect(authSpy).toHaveBeenCalledWith("123@gmail.com", "any_password");
  });

  test("Should return error when accessToken is null", async () => {
    const { sut, authentication } = makeSut();
    jest
      .spyOn(authentication, "auth")
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));

    const response = await sut.handle({
      body: {
        email: "123@gmail.com",
        password: "any_password",
      },
    });
    expect(response).toEqual(unauthorized());
  });
});
