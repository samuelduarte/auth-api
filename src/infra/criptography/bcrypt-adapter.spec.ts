import bcrypt from "bcrypt";
import { BcryptAdapter } from "./bcrypt-adapter";

describe("Bcrypt Adapter", () => {
  test("should call bcrypt", () => {
    const salt = 12;
    const sut = new BcryptAdapter(salt);
    const bcryptSpyOn = jest.spyOn(bcrypt, "hash");
    sut.encrypt("any_value");
    expect(bcryptSpyOn).toHaveBeenCalledWith("any_value", salt);
  });
});
