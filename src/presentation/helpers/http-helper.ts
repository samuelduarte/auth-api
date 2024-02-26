import { ServerError } from "../error/server-error";
import { HttpResponse } from "../protocols/http";

export const BadRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
});

export const ServerErrorInternal = (): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(),
});
