import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/database.js";
import db2 from "./config/database2.js";
import dbwil from "./config/databasewil.js";
import SequelizeStore from "connect-session-sequelize";

import UserRoute from "./routes/UserRoute.js";
import MahasiswaRoute from "./routes/MahasiswaRoute.js";
import SidebarRoute from "./routes/SidebarRoute.js";
import PostalRoute from "./routes/PostalRoute.js";
import DosenRoute from "./routes/DosenRoute.js";
import KHSRoute from "./routes/KHSRoute.js";
import IRSRoute from "./routes/IRSRoute.js";
import PKLRoute from "./routes/PKLRoute.js";
import SkripsiRoute from "./routes/SkripsiRoute.js";
import DesaRoute from "./routes/DesaRoute.js";

dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
  db: db,
  db2: db2,
  dbwil: dbwil,
});

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      secure: "auto",
    },
  })
);

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:1234",
  })
);
app.use(express.json());
app.use(UserRoute);
app.use(MahasiswaRoute);
app.use(SidebarRoute);
app.use(PostalRoute);
app.use(DosenRoute);
app.use(KHSRoute);
app.use(IRSRoute);
app.use(PKLRoute);
app.use(SkripsiRoute);
app.use(DesaRoute);

app.listen(process.env.APP_PORT, () => {
  console.log("Server up and running...");
});
