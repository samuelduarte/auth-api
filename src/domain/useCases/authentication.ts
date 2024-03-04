export interface AuthencationModel {
  email: string;
  password: string;
}

export interface Authentication {
  auth(email: string, password: string): Promise<string>;
}
