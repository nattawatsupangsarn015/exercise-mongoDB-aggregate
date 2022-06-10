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
