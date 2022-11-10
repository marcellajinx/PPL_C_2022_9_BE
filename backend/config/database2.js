import { Sequelize } from "sequelize";

const db2 = new Sequelize("db_kodepos", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db2;
