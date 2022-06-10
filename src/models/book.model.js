//book.model.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const books = new Schema(
  {
    name: { type: String },
    descriptions: { type: String },
    author: { type: String },
    price: { type: Number },
    publicDate: { type: Date },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("books", books);
