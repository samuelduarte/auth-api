import {
  AccountModel,
  AddAccountModel,
  Encrypter,
  AddAccountRepository,
} from "./db-add-account-protocols";
import { DbAddAccount } from "./db-add-account";

describe("DbAddAccount", () => {
  const makeAddAccountRepository = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
      async add(input: AddAccountModel): Promise<AccountModel> {
        const fakeAccount = {
          id: "valid_id",
          name: "valid",
          email: "valid@gmail.com",
          password: "hashed_value",
        };
        return new Promise((resolve) => resolve(fakeAccount));
      }
    }
    return new AddAccountRepositoryStub();
  };

  const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter {
      async encrypt(value: string): Promise<string> {
        return new Promise((resolve) => resolve("hashed_value"));
      }
    }
    return new EncrypterStub();
  };

  interface SubTypes {
    sut: DbAddAccount;
    encrypterStub: Encrypter;
    addAccountRepositoryStub: AddAccountRepository;
  }

  const makeSut = (): SubTypes => {
    const encrypterStub = makeEncrypter();
    const addAccountRepositoryStub = makeAddAccountRepository();
    const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);
    return {
      sut,
      encrypterStub,
      addAccountRepositoryStub,
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

  test("Should call addAccountRepository with success", async () => {
    const { addAccountRepositoryStub, sut } = makeSut();
    const addAccountSpy = jest.spyOn(addAccountRepositoryStub, "add");
    const data = {
      name: "valid",
      email: "valid@gmail.com",
      password: "valid_password",
    };
    await sut.add(data);
    expect(addAccountSpy).toHaveBeenCalledWith({
      name: "valid",
      email: "valid@gmail.com",
      password: "hashed_value",
    });
  });
});
