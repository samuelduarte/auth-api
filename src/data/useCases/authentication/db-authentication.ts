import { Authentication } from "../../../domain/useCases/authentication";
import { HashComparer } from "../../protocols/hash-comparer";
import { UpdateAccessTokenRepository } from "../../protocols/update-access-token-repository";
import { Encrypter } from "../add-account/db-add-account-protocols";
import { LoadAccountByEmailRepository } from "../add-account/load-account-by-email-repository";

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashCompare: HashComparer,
    private readonly tokenGenerator: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}
  async auth(email: string, password: string): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(email);

    if (account) {
      const accessToken = await this.tokenGenerator.encrypt(account.id);
      await this.updateAccessTokenRepository.update(account.id, accessToken);
      return accessToken;
    }
    return null;
  }
}
