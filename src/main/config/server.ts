import express from "express";
import { adaptRoute } from "../adapter/express-route-adapter";
import { makeSignUpController } from "../factories/signup";
import { config } from "dotenv";
import { MongoClient } from "../../infra/db/mongodb/helpers/mongo";
import { makeLoginController } from "../factories/login";

const main = async () => {
  config();
  const app = express();
  app.use(express.json());
  await MongoClient.connect();

  app.post("/signup", adaptRoute(makeSignUpController()));
  app.post("/login", adaptRoute(makeLoginController()));

  const port = process.env.PORT || 8000;
  app.listen(8000, () => console.log(`Running Server at ${port}`));
};

main();
