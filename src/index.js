require("dotenv").config();

const express = require("express");
const app = express();
const PORT = 8080;
const cors = require("cors");

const connnectionMongoDB = require("./utils/mongo");

const connectMongo = async (req, res, next) => {
  await connnectionMongoDB();
  next();
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(connectMongo);
app.use("/api", require("./api"));

app.listen(PORT, () => {
  console.log("Start server with port : " + PORT);
});
