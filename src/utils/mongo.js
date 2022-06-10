const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

let isConnected;
let db;

module.exports = async function connectToDatabase() {
  if (isConnected) {
    return db;
  }

  db = await mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  isConnected = db.connections[0].readyState;

  return db;
};
