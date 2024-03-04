import { MongoClient as Mongo, Db } from "mongodb";

export const MongoClient = {
  client: undefined as unknown as Mongo,
  db: undefined as unknown as Db,

  async connect(): Promise<void> {
    const url = process.env.URL_MONGO || "localhost:27017";
    const username = process.env.USER_MONGO;
    const password = process.env.PASSWORD_MONGO;

    const client = new Mongo(url, { auth: { username, password } });
    const db = client.db("auth-api");

    this.client = client;
    this.db = db;

    console.log("connected to mongodb!");
  },
};
