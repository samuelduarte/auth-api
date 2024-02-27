import { DbAddAccount } from "./db-add-account";

describe("DbAddAccount", () => {
  test("Should call Encrypter with correct password", async () => {
    class EncrypterStub {
      async encrypt(value: string): Promise<string> {
        return new Promise((resolve) => resolve("hashed_value"));
      }
    }

    const encryptStub = new EncrypterStub();
    const sut = new DbAddAccount(encryptStub);
    const encriptySpy = jest.spyOn(encryptStub, "encrypt");
    const data = {
      name: "valid",
      email: "valid@gmail.com",
      password: "valid_password",
    };
    await sut.add(data);
    expect(encriptySpy).toHaveBeenCalledWith("valid_password");
  });
});
