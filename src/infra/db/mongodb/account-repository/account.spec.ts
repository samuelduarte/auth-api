import { MongoHelper } from "../helpers/helper-mongo";
import { AccountMongoRepository } from "./account";

describe("Account Mongo Repository", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnet();
  });

  beforeEach(() => {
    const accounts = MongoHelper.getColletion("accounts");
    accounts.deleteMany({});
  });

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository();
  };

  test("should return success", async () => {
    const sut = makeSut();

    const account = await sut.add({
      name: "valid",
      email: "valid@gmail.com",
      password: "123",
    });

    expect(account.id).toBeTruthy();
    expect(account.name).toBe("valid");
    expect(account.email).toBe("valid@gmail.com");
    expect(account.password).toBe("123");
  });
});
