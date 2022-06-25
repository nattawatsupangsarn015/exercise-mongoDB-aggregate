const model = require("../models/book.model");

const calSkip = (page, size) => {
  return (page - 1) * size;
};

module.exports.getAll = async (page, size) => {
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

module.exports.findByName = async (name) => {
  return await model.aggregate([
    { $match: { name: { $regex: name, $options: "i" } } },
  ]);
};

module.exports.search = async (query, page, size) => {
  return await model.aggregate([
    {
      $match: query.match,
    },
    {
      $project: {
        _id: {
          $toString: "$_id",
        },
        name: 1,
        descriptions: 1,
        author: 1,
        price: 1,
        publicDate: 1,
      },
    },
    query.sort,
    {
      $lookup: {
        from: "shelves",
        localField: "_id",
        foreignField: "books",
        pipeline: [
          {
            $project: {
              _id: 0,
              created_at: 0,
              updated_at: 0,
              books: 0,
            },
          },
        ],
        as: "shelf",
      },
    },
    { $unwind: { path: "$shelf", preserveNullAndEmptyArrays: true } },
    { $match: query.shelf },
    {
      $facet: {
        total: [{ $count: "total" }],
        data: [{ $skip: calSkip(page, size) }, { $limit: size }],
      },
    },
    { $unwind: { path: "$total", preserveNullAndEmptyArrays: true } },
    {
      $set: {
        total: "$total.total",
      },
    },
  ]);
};

module.exports.sortByPublicDate = async (order) => {
  return await model.aggregate([{ $sort: { publicDate: order } }]);
};

module.exports.sortByName = async (order) => {
  return await model.aggregate([{ $sort: { name: order } }]);
};

module.exports.sortByPrice = async (order) => {
  return await model.aggregate([{ $sort: { price: order } }]);
};

module.exports.sortByAuthor = async (order) => {
  return await model.aggregate([{ $sort: { author: order } }]);
};

module.exports.filterDate = async (startDate, endDate) => {
  return await model.aggregate([
    {
      $match: {
        publicDate: {
          $gt: new Date(startDate),
          $lt: new Date(endDate),
        },
      },
    },
    {
      $sort: { publicDate: 1 },
    },
  ]);
};

module.exports.groupByPrice = async () => {
  return await model.aggregate([
    {
      $facet: {
        "0-100": [
          {
            $match: {
              price: { $gt: 0, $lt: 101 },
            },
          },
          { $project: { _id: 1 } },
          { $sort: { price: 1 } },
        ],
        "101-200": [
          {
            $match: {
              price: { $gt: 101, $lt: 201 },
            },
          },
          { $project: { _id: 1 } },
          { $sort: { price: 1, price: 1 } },
        ],
        "201-300": [
          {
            $match: {
              price: { $gt: 201, $lt: 301 },
            },
          },
          { $project: { _id: 1 } },
          { $sort: { price: 1 } },
        ],
        "301-400": [
          {
            $match: {
              price: { $gt: 301, $lt: 401 },
            },
          },
          { $project: { _id: 1 } },
          { $sort: { price: 1 } },
        ],
      },
    },
  ]);
};

module.exports.sampleBooks = async (size) => {
  return await model.aggregate([
    {
      $project: {
        _id: 1,
      },
    },
    { $sample: { size: size } },
  ]);
};
