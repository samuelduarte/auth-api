import {
  AuthencationModel,
  Authentication,
} from "../../../domain/useCases/authentication";
import { HashComparer } from "../../protocols/hash-comparer";
import { TokenGenerator } from "../../protocols/token-generator";
import { UpdateAccessTokenRepository } from "../../protocols/update-access-token-repository";
import { LoadAccountByEmailRepository } from "../add-account/load-account-by-email-repository";

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashCompare: HashComparer,
    private readonly tokenGenerator: TokenGenerator,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}
  async auth(email: string, password: string): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(email);
    if (account) {
      const isValid = await this.hashCompare.compare(
        password,
        account.password
      );
      if (isValid) {
        const accessToken = await this.tokenGenerator.generate(account.id);
        await this.updateAccessTokenRepository.update(account.id, accessToken);
        return accessToken;
      }
    }
    return null;
  }
}
