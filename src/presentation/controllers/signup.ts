import { InvalidParamError } from "../error/invalid-email-error";
import { MissingParamError } from "../error/missing-param-error";
import { ServerError } from "../error/server-error";
import { BadRequest } from "../helpers/http-helper";
import { Controller } from "../protocols/controller";
import { EmailValidator } from "../protocols/email-validator";
import { HttpRequest, HttpResponse } from "../protocols/http";

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

      const isValid = this.emailValidator.isValid(httpRequest.body.email);
      if (!isValid) {
        return BadRequest(new InvalidParamError("email"));
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: new ServerError(),
      };
    }
  }
}
