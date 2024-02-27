import { Encrypter } from "../../protocols/encrypter";
import { DbAddAccount } from "./db-add-account";

describe("DbAddAccount", () => {
  interface SubTypes {
    sut: DbAddAccount;
    encrypterStub: Encrypter;
  }

  const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter {
      async encrypt(value: string): Promise<string> {
        return new Promise((resolve) => resolve("hashed_value"));
      }
    }
    return new EncrypterStub();
  };
  const makeSut = (): SubTypes => {
    const encrypterStub = makeEncrypter();
    const sut = new DbAddAccount(encrypterStub);
    return {
      sut,
      encrypterStub,
    };
  };

  test("Should call Encrypter with correct password", async () => {
    const { encrypterStub, sut } = makeSut();
    const encriptySpy = jest.spyOn(encrypterStub, "encrypt");
    const data = {
      name: "valid",
      email: "valid@gmail.com",
      password: "valid_password",
    };
    await sut.add(data);
    expect(encriptySpy).toHaveBeenCalledWith("valid_password");
  });

  test("Should retur error when Encrypter throws", async () => {
    const { encrypterStub, sut } = makeSut();
    jest
      .spyOn(encrypterStub, "encrypt")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const data = {
      name: "valid",
      email: "valid@gmail.com",
      password: "valid_password",
    };
    const promise = sut.add(data);
    await expect(promise).rejects.toThrow();
  });
});
