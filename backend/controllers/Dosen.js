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
              [Sequelize.Op.like]: Sequelize.literal(`'%${req.keyword}%'`), // dosen
            },
          },
          {
            nama: {
              [Sequelize.Op.like]: Sequelize.literal(`'%${req.keyword}%'`), // dosen
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
    if (!dosen) return res.status(404).json({ msg: "Data tidak ditemukan" });
    if (req.files === null) return res.status(400).json({msg: "No Images Uploaded"})

    dosen.email = req.body.email;
    dosen.no_hp = req.body.kontak;

    const file = req.files.file;
    const fileSize = file.size;
    const ext = path.extname(file.name)
    const fileName = file.md5 + ext
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedType = ['.png','.jpg','.jpeg'];
    if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
    if(fileSize > 5000000) return res.status(422).json({msg: "Image must be less than 5 MB"});

    dosen.image = fileName;
    dosen.url = url;

    file.mv(`./public/images/${fileName}`, async(err)=>{
      if(err) return res.status(500).json({msg: err.message});
      try {
        dosen.save();
        res.status(200).json({ msg: "Product updated successfuly" });
      } catch (error) {
        console.log(error.message);
      }
    })    
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
