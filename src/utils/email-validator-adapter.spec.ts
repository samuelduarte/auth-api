import { EmailValidatorAdapter } from "./email-validator";

describe("Email Validator Adapter", () => {
  test("Should return false if validator return false", () => {
    const sut = new EmailValidatorAdapter();
    const isValid = sut.isValid("invalid_email@gmail.com");
    expect(isValid).toBe(false);
  });
});
