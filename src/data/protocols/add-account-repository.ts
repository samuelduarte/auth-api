import { AddAccountModel } from "../../domain/useCases/add-account";
import { AccountModel } from "../../domain/models/account";

export interface AddAccountRepository {
  add(input: AddAccountModel): Promise<AccountModel>;
}
