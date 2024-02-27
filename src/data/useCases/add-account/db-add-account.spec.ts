import { Encrypter } from "../../protocols/encrypter";
import { DbAddAccount } from "./db-add-account";

describe("DbAddAccount", () => {
  interface SubTypes {
    sut: DbAddAccount;
    encrypterStub: Encrypter;
  }
  const makeSut = (): SubTypes => {
    class EncrypterStub {
      async encrypt(value: string): Promise<string> {
        return new Promise((resolve) => resolve("hashed_value"));
      }
    }

    const encrypterStub = new EncrypterStub();
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
});
