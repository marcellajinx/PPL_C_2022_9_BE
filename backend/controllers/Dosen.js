import { Sequelize } from "sequelize";
import Dosen from "../models/DosenModel.js";
import path from "path";
import fs from "fs";

export const GetCountDosen = async (req, res) => {
  try {
    const dosen = await Dosen.findAll({
      where: {
        nip: {
          [Sequelize.Op.like]: Sequelize.literal("'99%'"), // dosen
        },
      },
    });
    if (!dosen) return res.status(200).json({ msg: 0 });
    res.status(200).json({ msg: dosen.length });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const GetCountAdm = async (req, res) => {
  try {
    const dosen = await Dosen.findAll({
      where: {
        nip: {
          [Sequelize.Op.like]: Sequelize.literal("'88%'"), // admin
        },
      },
    });
    if (!dosen) return res.status(200).json({ msg: 0 });
    res.status(200).json({ msg: dosen.length });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const GetCountDept = async (req, res) => {
  try {
    const dosen = await Dosen.findAll({
      where: {
        nip: "0",
      },
    });
    if (!dosen) return res.status(200).json({ msg: 0 });
    res.status(200).json({ msg: dosen.length });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const GetAllDoswal = async (req, res) => {
  try {
    const doswal = await Dosen.findAll({
      where: {
        nip: {
          [Sequelize.Op.like]: Sequelize.literal("'99%'"), // dosen
        },
      },
    });
    // const doswal = await Dosen.findAll();
    res.status(200).json(doswal);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const GetAllAdm = async (req, res) => {
  try {
    const dosen = await Dosen.findAll({
      where: {
        nip: {
          [Sequelize.Op.like]: Sequelize.literal("'88%'"), // admin
        },
      },
    });
    res.status(200).json(dosen);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const GetAllDoswalByKeyword = async (req, res) => {
  try {
    const dosen = await Dosen.findAll({
      where: {
        nip: {
          [Sequelize.Op.like]: Sequelize.literal("'99%'"), // dosen
        },
        [Sequelize.Op.or]: [
          {
            nip: {
              [Sequelize.Op.like]: Sequelize.literal(
                `'%${req.params.keyword}%'`
              ), // dosen
            },
          },
          {
            nama: {
              [Sequelize.Op.like]: Sequelize.literal(
                `'%${req.params.keyword}%'`
              ), // dosen
            },
          },
        ],
      },
    });
    res.status(200).json(dosen);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const GetDoswal = async (req, res) => {
  try {
    console.log(req.params);
    const doswal = await Dosen.findOne({
      where: {
        kode_wali: req.params.kode,
      },
    });
    res.status(200).json(doswal);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateDataDsn = async (req, res) => {
  try {
    const dosen = await Dosen.findOne({
      where: {
        nip: req.params.nip,
      },
    });
    if (!dosen) {
      res.statusMessage = "No lecturers data found.";
      res.status(404).json({ msg: "Data tidak ditemukan" }).end();
      return res;
    }

    // no uploaded image, no previous image
    if (req.files === null && dosen.image === null && dosen.url === null) {
      res.statusMessage = "You must upload your photo.";
      res.status(400).json({ msg: "No Images Uploaded" }).end();
      return res;
    }

    // no uploaded image, has previous image
    if (req.files === null && dosen.image !== null && dosen.url !== null) {
      dosen.email = req.body.email;
      dosen.no_hp = req.body.kontak;
      try {
        dosen.save();
        res.statusMessage = "Data updated successfully";
        return res.status(200).json({ msg: "Data updated successfuly" });
      } catch (error) {
        return error.message;
      }
    }

    // has uploaded image
    const file = req.files.file;
    const fileSize = file.size;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedType = [".png", ".jpg", ".jpeg"];
    if (!allowedType.includes(ext.toLowerCase())) {
      res.statusMessage = "File must be .jpg, .jpeg, or .png";
      res.status(422).json({ msg: "File must be .jpg, .jpeg, or .png" }).end();
      return res;
    }
    if (fileSize > 5000000) {
      res.statusMessage = "Maximum image size is 5MB";
      res.status(422).json({ msg: "Maximum image size is 5MB" }).end();
      return res;
    }

    dosen.email = req.body.email;
    dosen.no_hp = req.body.kontak;
    dosen.image = fileName;
    dosen.url = url;

    file.mv(`./public/images/${fileName}`, async (err) => {
      if (err) return res.status(500).json({ msg: err.message });
      try {
        dosen.save();
        res.status(200).json({ msg: "Product updated successfuly" });
      } catch (error) {
        console.log(error.message);
      }
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
