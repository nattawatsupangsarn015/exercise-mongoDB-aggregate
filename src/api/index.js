const express = require("express");
const route = express.Router();
const bookRepo = require("../repositories/book.repos");
const shelfRepo = require("../repositories/shelf.repos");

route.get("/", async (req, res) => {
  res.status(200).send(":)").end();
});

route.get("/books", async (req, res, next) => {
  try {
    const { page, size } = req.query;
    const result = await bookRepo.getAll(page || 1, size || 25);
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

route.get("/books/query", async (req, res, next) => {
  try {
    const { page, size, name, sort, isActive, startDate, endDate } = req.query;
    const query = {
      match: { $and: [] },
      sort: { $sort: {} },
      shelf: {},
    };
    const orderMap = { asc: 1, des: -1 };

    if (name !== undefined) {
      query.match.$and.push({ name: { $regex: name, $options: "i" } });
    }

    if (sort !== undefined) {
      const queryStrings = sort.split(",");
      for (let q of queryStrings) {
        const [field, order] = q.split(" ");
        if (field === "author") {
          query.sort.$sort.author = orderMap[order];
        } else if (field === "name") {
          query.sort.$sort.name = orderMap[order];
        } else if (field === "price") {
          query.sort.$sort.price = orderMap[order];
        } else if (field === "publicDate") {
          query.sort.$sort.publicDate = orderMap[order];
        }
      }
    } else {
      query.sort.$sort = { updated_at: 1 };
    }

    if (startDate !== undefined && endDate !== undefined) {
      query.match.$and.push({
        publicDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      });
    }

    if (isActive !== undefined) {
      query.shelf = { "shelf.isActive": isActive === "true" ? true : false };
    }

    if (query.match.$and.length === 0) {
      query.match = {};
    }

    const result = await bookRepo.search(
      query,
      Number(page) || 1,
      Number(size) || 25
    );
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

route.post("/shelf", async (req, res, next) => {
  try {
    const { name, column, isActive, books } = req.body;
    const shelf = {
      name: name,
      column: column,
      isActive: isActive,
      books: books,
    };

    const result = await shelfRepo.create(shelf);
    res.status(201).send(result).end();
  } catch (err) {
    next(err);
  }
});

route.post("/books/random", async (req, res, next) => {
  try {
    const { size } = req.body;
    const sampleBooks = await bookRepo.sampleBooks(size);
    res.status(201).send(sampleBooks).end();
  } catch (err) {
    next(err);
  }
});

route.put("/shelf", async (req, res, next) => {
  try {
    const { shelfId, bookId } = req.body;
    const hasBook = await shelfRepo.checkBook(bookId);
    if (!!hasBook.length) {
      throw { statusCode: 400, message: "There's this book in the shelf." };
    }
    const result = await shelfRepo.addBook(shelfId, bookId);
    res.status(201).send(result).end();
  } catch (err) {
    next(err);
  }
});

route.get("/shelves", async (req, res, next) => {
  try {
    const result = await shelfRepo.getAll();
    res.status(200).send(result).end();
  } catch (err) {
    next(err);
  }
});

route.get("/shelves/query", async (req, res, next) => {
  try {
    const { page, size, name, sort, isActive } = req.query;
    const query = {
      match: { $and: [] },
      sort: { $sort: {} },
    };
    const orderMap = { asc: 1, des: -1 };

    if (name !== undefined) {
      query.match.$and.push({ name: { $regex: name, $options: "i" } });
    }

    if (sort !== undefined) {
      const queryStrings = sort.split(",");
      for (let q of queryStrings) {
        const [field, order] = q.split(" ");
        if (field === "column") {
          query.sort.$sort.column = orderMap[order];
        } else if (field === "name") {
          query.sort.$sort.name = orderMap[order];
        } else if (field === "book") {
          query.sort.$sort.numberOfBooks = orderMap[order];
        }
      }
    } else {
      query.sort.$sort = { updated_at: 1 };
    }

    if (isActive !== undefined) {
      query.match.$and.push({ isActive: isActive === "true" ? true : false });
    }

    if (query.match.$and.length === 0) {
      query.match = {};
    }

    const [result] = await shelfRepo.search(
      query,
      Number(page) || 1,
      Number(size) || 25
    );
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
