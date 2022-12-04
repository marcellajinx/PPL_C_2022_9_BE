import User from "../models/UserModel.js";
import Mahasiswa from "../models/MahasiswaModel.js";
import Dosen from "../models/DosenModel.js";
import bcrypt from "bcrypt";

export const CreateUser = async (req, res) => {
  const { roles, username, password, status, nama, nomorid, angkatan } =
    req.body;
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    // mhs, dosen, dept, op
    if (roles == 1) {
      // mahasiswa
      await User.create({
        roles,
        nim: nomorid,
        nip: 0,
        username,
        password: hashPassword,
        status,
        nama,
        angkatan,
      });
    } else {
      await User.create({
        roles,
        nim: 0,
        nip: nomorid,
        username,
        password: hashPassword,
        status,
        nama,
        angkatan: "0",
      });
    }

    try {
      if (roles == 1) {
        await Mahasiswa.create({
          nim: nomorid,
          nama,
          status_mhs: status,
          alamat: "NOT SET",
          email: "NOT SET",
          jalur_masuk: "SNMPTN",
          no_hp: "NOT SET",
          angkatan,
          tempat_lahir: "NOT SET",
          kode_wali: "1002",
          provinsi: "11",
          tgl_lahir: new Date().toJSON().slice(0, 10).replace(/-/g, "/"),
        });
      } else if (roles == 2) {
        await Dosen.create({
          nip: nomorid,
          nama,
          email: username.split(" ")[0] + "@gmail.com",
          no_hp: "NOT SET",
        });
      } else if (roles == 3) {
        await Dosen.create({
          // kode_wali: 999,
          nip: nomorid,
          nama,
          email: username.split(" ")[0] + "@gmail.com",
          no_hp: "NOT SET",
        });
      } else {
        await Dosen.create({
          // kode_wali: 998,
          nip: nomorid,
          nama,
          email: username.split(" ")[0] + "@gmail.com",
          no_hp: "NOT SET",
        });
      }

      res.json({
        message: "User Created",
      });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
};

export const Login = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.status(400).json({ msg: "Wrong Password" });

    req.session.userId = user.id_user;
    req.session.role = user.roles;
    req.session.nim = user.nim;
    req.session.nip = user.nip;

    const username = user.username;
    const nim = user.nim;
    const nip = user.nip;
    const roles = user.roles;

    res.status(200).json({ username, nim, nip, roles });
  } catch (error) {
    console.log(req.body);
    res.status(404).json({ msg: "Username not found" });
  }
};

export const Me = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ msg: "Mohon login ke akun Andaa!" });
  }

  console.log(8877);
  console.log(req.session);

  let user;

  if (req.session.role == 1) {
    user = await Mahasiswa.findOne({
      where: {
        nim: req.session.nim,
      },
    });
  }

  if (req.session.role == 2 || req.session.role == 3 || req.session.role == 4) {
    user = await Dosen.findOne({
      where: {
        nip: req.session.nip,
      },
    });
  }

  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

  user.roles = req.session.role;
  res.status(200).json(user);
};

export const Logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(400).json({ msg: "Tidak dapat logout" });
    res.status(200).json({ msg: "Anda telah logout" });
  });
};
