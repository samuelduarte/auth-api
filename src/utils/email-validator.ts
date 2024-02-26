import { EmailValidator } from "../presentation/protocols";
import Validator from "validator";

export class EmailValidatorAdapter implements EmailValidator {
  isValid(email: string): boolean {
    return Validator.isEmail(email);
  }
}
