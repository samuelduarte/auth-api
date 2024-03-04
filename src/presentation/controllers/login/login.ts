import { MissingParamError } from "../../error";
import { BadRequest } from "../../helpers/http-helper";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";

export class LoginController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email) {
      return new Promise((resolve) =>
        resolve(BadRequest(new MissingParamError("email")))
      );
    }

    if (!httpRequest.body.password) {
      return new Promise((resolve) =>
        resolve(BadRequest(new MissingParamError("password")))
      );
    }
  }
}
