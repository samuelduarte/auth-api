import { Encrypter } from "../../../data/protocols/encrypter";
import bcrypt from "bcrypt";
import { HashComparer } from "../../../data/protocols/hash-comparer";
export class BcryptAdapter implements Encrypter, HashComparer {
  constructor(private readonly salt: number) {}

  async encrypt(value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    const isValid = await bcrypt.compare(value, hash);
    return isValid;
  }
}
