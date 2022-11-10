import { Sequelize } from "sequelize";

const dbwil = new Sequelize("db_wilayah", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default dbwil;
