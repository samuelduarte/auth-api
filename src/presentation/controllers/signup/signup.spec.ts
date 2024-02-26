import { InvalidParamError, MissingParamError, ServerError } from "../../error";
import {
  EmailValidator,
  AccountModel,
  AddAccount,
  AddAccountModel,
} from "../signup/signup-protocols";
import { SignUpController } from "./signup";

describe("SignUpController", () => {
  const makeEmailValidator = () => {
    class EmailValidatorStub implements EmailValidator {
      isValid(email: string): boolean {
        return true;
      }
    }

    return new EmailValidatorStub();
  };

  const makeAddAcount = (): AddAccount => {
    class AddAccountStub implements AddAccount {
      add(account: AddAccountModel): AccountModel {
        const fakeAccount = {
          id: "1",
          name: "any",
          email: "any@gmail.com",
          password: "123",
        };

        return fakeAccount;
      }
    }

    return new AddAccountStub();
  };

  interface SubTypes {
    sut: SignUpController;
    emailValidatorStub: EmailValidator;
    addAccountStub: AddAccount;
  }

  const makeSut = (): SubTypes => {
    const emailValidatorStub = makeEmailValidator();
    const addAccountStub = makeAddAcount();
    const sut = new SignUpController(emailValidatorStub, addAccountStub);

    return {
      sut,
      emailValidatorStub,
      addAccountStub,
    };
  };

  test("should return 400 if no name is informed", () => {
    const { sut } = makeSut();

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
    const { sut } = makeSut();

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

  test("should return 400 if password is not informed", () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: "teste",
        email: "teste@gmail.com",
        passwordConfirmation: "123",
      },
    };

    const response = sut.handle(httpRequest);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(new MissingParamError("password"));
  });

  test("should return 400 if passwordConfirmation is not informed", () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: "teste",
        email: "teste@gmail.com",
        password: "123",
      },
    };

    const response = sut.handle(httpRequest);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(
      new MissingParamError("passwordConfirmation")
    );
  });

  test("should return 400 if password confirmation is diferent that password", () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: "teste",
        email: "teste@gmail.com",
        password: "123",
        passwordConfirmation: "321",
      },
    };

    const response = sut.handle(httpRequest);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(
      new InvalidParamError("passwordConfirmation")
    );
  });

  test("should return 400 if email is valid", () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);

    const httpRequest = {
      body: {
        name: "teste",
        email: "invalid@gmail.com",
        password: "123",
        passwordConfirmation: "123",
      },
    };

    const response = sut.handle(httpRequest);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(new InvalidParamError("email"));
  });

  test("should return error when email is incorret", () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValid = jest.spyOn(emailValidatorStub, "isValid");

    const httpRequest = {
      body: {
        name: "teste",
        email: "any@gmail.com",
        password: "123",
        passwordConfirmation: "123",
      },
    };

    sut.handle(httpRequest);
    expect(isValid).toHaveBeenCalledWith("any@gmail.com");
  });

  test("should return error 500 ", () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new Error();
    });
    const httpRequest = {
      body: {
        name: "teste",
        email: "invalid@gmail.com",
        password: "123",
        passwordConfirmation: "123",
      },
    };

    const response = sut.handle(httpRequest);

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(new ServerError());
  });

  test("should call addAccount", () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, "add");

    const httpRequest = {
      body: {
        name: "any",
        email: "any@gmail.com",
        password: "123",
        passwordConfirmation: "123",
      },
    };

    sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith({
      name: "any",
      email: "any@gmail.com",
      password: "123",
    });
  });
});
