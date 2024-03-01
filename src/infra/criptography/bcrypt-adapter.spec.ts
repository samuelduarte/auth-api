import bcrypt from "bcrypt";
import { BcryptAdapter } from "./bcrypt-adapter";

describe("Bcrypt Adapter", () => {
  const salt = 12;
  const makeSutBcryptAdapter = (): BcryptAdapter => {
    return new BcryptAdapter(salt);
  };
  test("should call bcrypt", () => {
    const salt = 12;
    const sut = makeSutBcryptAdapter();
    const bcryptSpyOn = jest.spyOn(bcrypt, "hash");
    sut.encrypt("any_value");
    expect(bcryptSpyOn).toHaveBeenCalledWith("any_value", salt);
  });
});
