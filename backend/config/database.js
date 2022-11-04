import { Sequelize } from "sequelize";

const db = new Sequelize("tappl", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
