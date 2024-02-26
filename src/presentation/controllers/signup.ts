import { InvalidParamError, MissingParamError } from "../error";
import { BadRequest, ServerErrorInternal } from "../helpers/http-helper";
import {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
} from "../protocols";

export class SignUpController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}
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

      if (httpRequest.body.password !== httpRequest.body.passwordConfirmation) {
        return BadRequest(new InvalidParamError("passwordConfirmation"));
      }

      const isValid = this.emailValidator.isValid(httpRequest.body.email);
      if (!isValid) {
        return BadRequest(new InvalidParamError("email"));
      }
    } catch (error) {
      return ServerErrorInternal();
    }
  }
}
