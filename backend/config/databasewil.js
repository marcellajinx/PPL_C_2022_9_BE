import { Sequelize } from "sequelize";

const dbwil = new Sequelize("db_wilayah", "root", "123456", {
  host: "localhost",
  dialect: "mysql",
});

export default dbwil;
