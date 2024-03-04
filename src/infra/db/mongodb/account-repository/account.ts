import { AddAccountRepository } from "../../../../data/protocols/add-account-repository";
import { AccountModel } from "../../../../domain/models/account";
import { AddAccountModel } from "../../../../domain/useCases/add-account";
import { MongoClient } from "../helpers/mongo";
export class AccountMongoRepository implements AddAccountRepository {
  async add(input: AddAccountModel): Promise<AccountModel> {
    const accountColletion = await MongoClient.db.collection("accounts");
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
