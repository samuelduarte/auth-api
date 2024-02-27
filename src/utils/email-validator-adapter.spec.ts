import { EmailValidatorAdapter } from "./email-validator-adapter";
import validator from "validator";

jest.mock("validator", () => ({
  isEmail(): boolean {
    return true;
  },
}));

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter();
};

describe("Email Validator Adapter", () => {
  test("Should return false if validator return false", () => {
    const sut = makeSut();
    jest.spyOn(validator, "isEmail").mockReturnValueOnce(false);
    const isValid = sut.isValid("invalid_email@gmail.com");
    expect(isValid).toBe(false);
  });

  test("Should return true if validator return true", () => {
    const sut = makeSut();
    const isValid = sut.isValid("valid_email@gmail.com");
    expect(isValid).toBe(true);
  });

  test("Should call validator with email correct", () => {
    const sut = makeSut();
    const spyOnIsEmail = jest.spyOn(validator, "isEmail");
    sut.isValid("any@gmail.com");
    expect(spyOnIsEmail).toHaveBeenCalledWith("any@gmail.com");
  });
});
