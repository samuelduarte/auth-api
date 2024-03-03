import { MongoHelper } from "../helpers/helper-mongo";
import { AccountMongoRepository } from "./account";

describe("Account Mongo Repository", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnet();
  });

  test("should return success", async () => {
    const sut = new AccountMongoRepository();

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
