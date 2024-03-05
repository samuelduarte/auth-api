import { DbAuthentication } from "../../data/useCases/authentication/db-authentication";
import { LoginController } from "../../presentation/controllers/login/login";
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account";
import { BcryptAdapter } from "../../infra/criptography/bcrypt-adapter/bcrypt-adapter";
import { JwtAdapter } from "../../infra/criptography/jwt-adapter/jwt-adapter";

export const makeLoginController = (): LoginController => {
  const loadAccountByEmailRepository = new AccountMongoRepository();
  const bcryptAdapter = new BcryptAdapter(12);
  const jwtAdapter = new JwtAdapter("secret");
  const dbAuthentication = new DbAuthentication(
    loadAccountByEmailRepository,
    bcryptAdapter,
    jwtAdapter,
    loadAccountByEmailRepository
  );
  const emailValidator = new EmailValidatorAdapter();
  return new LoginController(emailValidator, dbAuthentication);
};
