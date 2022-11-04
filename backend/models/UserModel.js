import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const User = db.define(
  "tb_user",
  {
    id_user: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      validate: {
        notEmpty: true,
      },
    },
    nip: {
      type: DataTypes.CHAR,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    nim: {
      type: DataTypes.CHAR,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    username: {
      type: DataTypes.CHAR,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.CHAR,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    status: {
      type: DataTypes.CHAR,
      validate: {
        notEmpty: true,
      },
    },
    roles: {
      type: DataTypes.CHAR,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    nama: {
      type: DataTypes.CHAR,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    angkatan: {
      type: DataTypes.CHAR,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    refresh_token: {
      type: DataTypes.TEXT,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

(async () => {
  await db.sync();
})();

export default User;
