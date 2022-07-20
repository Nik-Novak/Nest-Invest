//@ts-check
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const { ExistingID, Integer } = require('./types/types');

const MarketSchema = new Schema(
  {
    name: { type:String, required:true },
    parent_id: { type:mongoose.Types.ObjectId },
    root_id: { type:mongoose.Types.ObjectId },
  },
);

MarketSchema.index({ name:1 });

const Market = mongoose.model('Market', MarketSchema);

module.exports = { Market };