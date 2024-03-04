import { InvalidParamError, MissingParamError } from "../../error";
import {
  BadRequest,
  ServerErrorInternal,
  ok,
  unauthorized,
} from "../../helpers/http-helper";
import {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
  Authentication,
} from "../login/login-protocols";

export class LoginController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body;

      const requiredFiels = ["email", "password"];
      for (const field of requiredFiels) {
        if (!httpRequest.body[field]) {
          return BadRequest(new MissingParamError(field));
        }
      }

      const isValid = this.emailValidator.isValid(email);

      if (!isValid) {
        return BadRequest(new InvalidParamError("email"));
      }

      const accessToken = await this.authentication.auth(email, password);

      if (!accessToken) {
        return unauthorized();
      }

      return ok({ accessToken });
    } catch (error) {
      throw ServerErrorInternal();
    }
  }
}
