//shelf.model.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shelf = new Schema(
  {
    name: { type: String },
    column: { type: Number },
    isActive: { type: Boolean },
    books: { type: Array },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("shelf", shelf);
