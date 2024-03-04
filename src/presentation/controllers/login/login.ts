import { Authentication } from "../../../domain/useCases/authentication";
import { InvalidParamError, MissingParamError } from "../../error";
import { BadRequest } from "../../helpers/http-helper";
import {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
} from "../../protocols";

export class LoginController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body;
    if (!email) {
      return new Promise((resolve) =>
        resolve(BadRequest(new MissingParamError("email")))
      );
    }

    if (!password) {
      return new Promise((resolve) =>
        resolve(BadRequest(new MissingParamError("password")))
      );
    }

    const isValid = this.emailValidator.isValid(email);

    if (!isValid) {
      return new Promise((resolve) =>
        resolve(BadRequest(new InvalidParamError("email")))
      );
    }

    await this.authentication.auth(email, password);
  }
}
