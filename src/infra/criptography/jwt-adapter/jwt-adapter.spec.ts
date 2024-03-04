import jwt from "jsonwebtoken";
import { JwtAdapter } from "./jwt-adapter";

describe("JwtAdapter", () => {
  test("Should call JwtAdapter", async () => {
    const sut = new JwtAdapter("secret");
    const spyJwt = jest.spyOn(jwt, "sign");
    await sut.encrypt("any_id");
    expect(spyJwt).toHaveBeenCalledWith({ id: "any_id" }, "secret");
  });
});
