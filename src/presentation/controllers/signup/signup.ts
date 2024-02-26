import { InvalidParamError, MissingParamError } from "../../error";
import { BadRequest, ServerErrorInternal, ok } from "../../helpers/http-helper";
import {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
  AddAccount,
} from "../signup/signup-protocols";

export class SignUpController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount
  ) {}
  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFiels = [
        "name",
        "email",
        "password",
        "passwordConfirmation",
      ];
      for (const field of requiredFiels) {
        if (!httpRequest.body[field]) {
          return BadRequest(new MissingParamError(field));
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body;
      if (password !== passwordConfirmation) {
        return BadRequest(new InvalidParamError("passwordConfirmation"));
      }

      const isValid = this.emailValidator.isValid(email);
      if (!isValid) {
        return BadRequest(new InvalidParamError("email"));
      }

      const account = this.addAccount.add({
        email,
        name,
        password,
      });

      return ok(account);
    } catch (error) {
      return ServerErrorInternal();
    }
  }
}
