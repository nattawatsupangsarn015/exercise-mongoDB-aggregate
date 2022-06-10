const express = require("express");
const route = express.Router();
const bookModel = require("../../models/bookModel");
const _ = require("lodash");

route.get("/", async (req, res) => {
  res.status(200).send("vonder test service").end();
});

route.post("/book", async (req, res) => {
  const book = {
    name: "Learnning mongodb",
    descriptions: "this book was created for learning about mongodb",
    author: "Nattawat Supangsarn",
    price: 500,
  };
  const result = await bookModel.create(book);
  res.status(201).send(result).end();
});

module.exports = route;
