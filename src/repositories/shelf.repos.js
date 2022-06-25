const model = require("../models/shelf.model");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const calSkip = (page, size) => {
  return (page - 1) * size;
};

module.exports.getAll = async () => {
  return await model.aggregate([
    {
      $facet: {
        pageInfo: [{ $count: "total" }],
        data: [
          {
            $project: {
              _id: 0,
              created_at: 0,
              updated_at: 0,
            },
          },
          { $skip: calSkip(page, size) },
          { $limit: size },
        ],
      },
    },
  ]);
};

module.exports.create = async (data) => {
  return await model.create(data);
};

module.exports.deleteAll = async () => {
  return await model.deleteMany();
};

module.exports.addBook = async (shelfId, bookId) => {
  return await model.findByIdAndUpdate(
    { _id: ObjectId(shelfId) },
    {
      $addToSet: { books: bookId },
    },
    { new: true }
  );
};

module.exports.checkBook = async (bookId) => {
  return await model.aggregate([{ $match: { books: bookId } }]);
};

module.exports.search = async (query, page, size) => {
  return await model.aggregate([
    {
      $match: query.match
    },
    {
      $project: {
        _id: 0,
        name: 1,
        column: 1,
        isActive: 1,
        books: {
          $map: {
            input: "$books",
            as: "book",
            in: {
              $convert: {
                input: "$$book",
                to: "objectId",
              },
            },
          },
        },
        numberOfBooks: {
          $cond: {
            if: { $isArray: "$books" },
            then: { $size: "$books" },
            else: "NA",
          },
        },
      },
    },
    {
      $project: { numberOfBooks: 0 },
    },
    query.sort,
    {
      $lookup: {
        from: "books",
        localField: "books",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              _id: 0,
              created_at: 0,
              updated_at: 0,
            },
          },
        ],
        as: "books",
      },
    },
    {
      $facet: {
        total: [{ $count: "total" }],
        data: [{ $skip: calSkip(page, size) }, { $limit: size }],
      },
    },
    {
      $unwind: { path: "$total", preserveNullAndEmptyArrays: true },
    },
    {
      $set: {
        total: "$total.total",
      },
    },
  ]);
};
