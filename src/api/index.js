const express = require("express");
const route = express.Router();
const bookRepo = require("../repositories/book.repos");

route.get("/", async (req, res) => {
  res.status(200).send(":)").end();
});

route.get("/books", async (req, res, next) => {
  try {
    const result = await bookRepo.getAll();
    res.status(200).send(result).end();
  } catch (err) {
    next(err);
  }
});

route.post("/book", async (req, res, next) => {
  try {
    const book = {
      name: "Learnning mongodb",
      descriptions: "this book was created for learning about mongodb",
      author: "Nattawat Supangsarn",
      price: 500,
    };
    const result = await bookRepo.create(book);
    res.status(201).send(result).end();
  } catch (err) {
    next(err);
  }
});

route.get("/books/generate", async (req, res, next) => {
  try {
    const Fakerator = require("fakerator");
    const fakerator = Fakerator("de-DE");
    let randomBooks = [];

    await bookRepo.deleteAll();

    for (let i = 0; i < 100; i++) {
      const name = fakerator.address.streetName();
      const descriptions = fakerator.company.name();
      const author = fakerator.names.name();
      const price = fakerator.random.number(10, 1000);
      const publicDate = fakerator.date.future(2022, new Date());
      randomBooks.push({ name, descriptions, author, price, publicDate });
    }

    await bookRepo.create(randomBooks);
    res.send(randomBooks).end();
  } catch (err) {
    next(err);
  }
});

route.get("/books/search", async (req, res, next) => {
  try {
    const { name } = req.query;
    const result = await bookRepo.findByName(name);
    res.status(200).send(result).end();
  } catch (err) {
    next(err);
  }
});

route.get("/books/filter", async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate) {
      throw { statusCode:400, message:"require startDate"}
    } else if (!endDate) {
      throw { statusCode:400, message:"require endDate"}
    } 
    const result = await bookRepo.filterDate(startDate, endDate);
    res.status(200).send(result).end();
  } catch (err) {
    next(err);
  }
});

route.get("/books/sort", async (req, res, next) => {
  try {
    const query = req.query;
    let result;
    let order;

    if (query.order === 'asc') {
      order = 1;
    } else if (query.order === 'desc'){
      order = -1;
    } else {
      throw { statusCode:400, message:"invalid order"}
    }

    if (!query.type) {
      throw { statusCode:400, message:"require type"}
    }

    switch (query.type) {
      case "publicDate":
        result = await bookRepo.sortByPublicDate(order);
        break;
      case "name":
        result = await bookRepo.sortByName(order);
        break;
      case "author":
        result = await bookRepo.sortByAuthor(order);
        break;
      case "price":
        result = await bookRepo.sortByPrice(order);
        break;
    }

    res.status(200).send(result).end();
  } catch (err) {
    next(err);
  }
});

route.get("/books/group/price", async (req, res, next) => {
  try {
    const result = await bookRepo.groupByPrice();
    res.status(200).send(result).end();
  } catch (err) {
    next(err);
  }
});

// Error handler
route.use((err, req, res, next) => {
  console.log({ err });
  res
    .status(err.statusCode ? err.statusCode : 500)
    .send(err.message)
    .end();
});

module.exports = route;
