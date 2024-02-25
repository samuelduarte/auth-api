export class SignUpController {
  handle(input: any): any {
    return {
      statusCode: 400,
      body: new Error("missing param: name"),
    };
  }
}
