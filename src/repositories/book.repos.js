const model = require("../models/book.model");

module.exports.getAll = async () => {
  return await model.find();
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
