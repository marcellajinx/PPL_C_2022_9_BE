import { listAdm, listDsn, listMhs, listDept } from "../models/ListSidebar.js";

export const GetSidebar = async (req, res) => {
  try {
    let response;
    if (req.session.role === "1") {
      response = listMhs;
    } else if (req.session.role === "2") {
      response = listDsn;
    } else if (req.session.role === "4") {
      response = listAdm;
    } else if (req.session.role === "3") {
      response = listDept;
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
