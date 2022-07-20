//@ts-check
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { Market } = require('./Market');

const { ExistingID } = require('./types/types');


const CompanySchema = new Schema(
  {
    name: { type:'string', required:true },
    address: { type:'string', required:true },
    market_tag_id: { ...ExistingID(Market), required:true }
  },
);

CompanySchema.index({address:1}, {unique:true});

const Company = mongoose.model('Company', CompanySchema);

module.exports = { Company };