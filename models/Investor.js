//@ts-check
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { ExistingID } = require('./types/types');
const { Company } = require('./Company');
const InvestorSchema = new Schema(
  {
    first_name: { type: 'string', required:true },
    last_name: { type: 'string', required:true },
    company_ids: { type:[ ExistingID(Company) ], default:[] }
  },
);

InvestorSchema.index({first_name:1, last_name:1}, {unique:true});

const Investor = mongoose.model('Investor', InvestorSchema);

module.exports = { Investor };