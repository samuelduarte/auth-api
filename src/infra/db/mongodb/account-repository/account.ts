import { ObjectId } from "mongodb";
import { AddAccountRepository } from "../../../../data/protocols/add-account-repository";
import { UpdateAccessTokenRepository } from "../../../../data/protocols/update-access-token-repository";
import { LoadAccountByEmailRepository } from "../../../../data/useCases/add-account/load-account-by-email-repository";
import { AccountModel } from "../../../../domain/models/account";
import { AddAccountModel } from "../../../../domain/useCases/add-account";
import { MongoClient } from "../helpers/mongo";
export class AccountMongoRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository
{
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

  async load(email: string): Promise<AccountModel> {
    const accountColletion = await MongoClient.db.collection("accounts");

    const account = await accountColletion.findOne({ email: email });
    console.log("Account", account);

    return {
      email: "",
      name: "",
      password: "",
      id: null,
    };
  }

  async update(id: string, token: string) {
    const accountColletion = await MongoClient.db.collection("accounts");
    await accountColletion.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          accessToken: token,
        },
      }
    );
  }
}
