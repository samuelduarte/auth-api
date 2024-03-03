import { AddAccountRepository } from "../../../../data/protocols/add-account-repository";
import { AccountModel } from "../../../../domain/models/account";
import { AddAccountModel } from "../../../../domain/useCases/add-account";
import { MongoHelper } from "../helpers/helper-mongo";
export class AccountMongoRepository implements AddAccountRepository {
  async add(input: AddAccountModel): Promise<AccountModel> {
    const accountColletion = await MongoHelper.getColletion("accounts");
    const { insertedId } = await accountColletion.insertOne(input);

    const account = await accountColletion.findOne({ _id: insertedId });
    return {
      email: account.email,
      name: account.name,
      password: account.password,
      id: account._id.toHexString(),
    };
  }
}
