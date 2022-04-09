import env from "../env";
import User from "./entities/user";

export default {
  port: env.port,
  appUrl: env.appUrl,
  corsOrigins: env.corsOrigins,
  bcryptRounds: env.bcryptRounds,
  database: {
    host: env.database.host,
    name: env.database.name,
    dialect: env.database.dialect,
    username: env.database.username,
    password: env.database.password,
    entities: [User],
  },
  jwt: {
    secret: env.jwt.secret,
  },
};
