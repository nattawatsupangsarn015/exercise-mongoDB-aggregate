const model = require("../models/shelf.model");

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
    { $project: { _id: 1, books: 1 } },
  ]);
};

module.exports.filterActive = async (isActive) => {
  return await model.aggregate([{ $match: { isActive: isActive } }]);
};

module.exports.sortByColumn = async (order) => {
  return await model.aggregate([{ $sort: { column: order } }]);
};

module.exports.sortByName = async (order) => {
  return await model.aggregate([{ $sort: { name: order } }]);
};

module.exports.sortByBooks = async (order) => {
  return await model.aggregate([
    {
      $project: {
        numberOfBooks: {
          $cond: {
            if: { $isArray: "$books" },
            then: { $size: "$books" },
            else: "NA",
          },
        },
        numberOfBooks:0
      },
    },
    { $sort: { numberOfBooks: order } },
  ]);
};
