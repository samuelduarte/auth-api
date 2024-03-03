import { Collection, MongoClient } from "mongodb";

export const MongoHelper = {
  client: null as MongoClient,

  async connect(url: string): Promise<void> {
    this.client = await MongoClient.connect(process.env.MONGO_URL);
  },

  async disconnet(): Promise<void> {
    await this.client;
  },
  getColletion(name: string): Collection {
    return this.client.db().collection(name);
  },
};
