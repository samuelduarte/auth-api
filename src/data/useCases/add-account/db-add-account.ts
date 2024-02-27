import { AddAccountRepository } from "../../protocols/add-account-repository";
import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  Encrypter,
} from "../add-account/db-add-account-protocols";

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly encrypter: Encrypter,
    private readonly addAccountRepo: AddAccountRepository
  ) {}
  async add(input: AddAccountModel): Promise<AccountModel> {
    const passwordHashed = await this.encrypter.encrypt(input.password);
    await this.addAccountRepo.add(
      Object.assign({}, input, { password: passwordHashed })
    );
    return new Promise((resolve) => resolve(null));
  }
}
