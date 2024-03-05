import jwt from "jsonwebtoken";
import { JwtAdapter } from "./jwt-adapter";

jest.mock("jsonwebtoken", () => ({
  async sign(): Promise<string> {
    return "any_token";
  },
}));
describe("JwtAdapter", () => {
  const makeSut = (): JwtAdapter => {
    return new JwtAdapter("secret");
  };
  test("Should call JwtAdapter with correct values", async () => {
    const sut = makeSut();
    const spyJwt = jest.spyOn(jwt, "sign");
    await sut.encrypt("any_id");
    expect(spyJwt).toHaveBeenCalledWith({ id: "any_id" }, "secret");
  });

  test("Should return success on sign finished", async () => {
    const sut = makeSut();
    const accessToken = await sut.encrypt("any_id");
    expect(accessToken).toBe("any_token");
  });
});
