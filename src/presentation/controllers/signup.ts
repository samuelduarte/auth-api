import { MissingParamError } from "../error/missing-param-error";
import { BadRequest } from "../helpers/http-helper";
import { HttpRequest, HttpResponse } from "../protocols/http";

export class SignUpController {
  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFiels = ["name", "email", "password", "passwordConfirmation"];
    for (const field of requiredFiels) {
      if (!httpRequest.body[field]) {
        return BadRequest(new MissingParamError(field));
      }
    }
  }
}
