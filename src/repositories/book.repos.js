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
      $project: { _id: 1},
    },
  ]);
};
