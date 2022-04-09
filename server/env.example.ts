import { Dialect } from "sequelize";

export default {
  port: 3000,
  appUrl: "http://localhost:8080",
  corsOrigins: ["http://localhost:8080"],
  bcryptRounds: 12,
  database: {
    host: `127.0.0.1`,
    name: `board-game`,
    dialect: `mysql` as Dialect,
    username: `board-game`,
    password: `secret`,
  },
  jwt: {
    secret: `secret`,
  },
};
