//@ts-check
const path = require('path');
const fs = require('fs');

let config, database;

function success(payload, req, res){
  console.log('SUCCESS')
  // build response here
  res.status(200).send(payload);
}

function fail(payload, req, res){
  console.log('FAILURE')
  // build response here
  res.status(payload.code).send(payload);
}

let operationHandler = async function(req, res){
try{
  console.log('Executing Operation: ' + path.relative(process.cwd(),__filename));
  let {company_ids} = req.query;
  console.log(company_ids);
  let markets = [];
  if(company_ids){
    let query = {_id: { $in:company_ids }};
    let companies = await database.readCompanies(query).populate('market_tag_id');
    markets = companies.map(c=>c.market_tag_id);
  }
  else
    markets = await database.readMarkets();
  success(markets, req, res);
}catch(error){
  console.log(error);
  fail({code:500, error, message: `An unknown error occurred on our back end. Please file a bug report and try again later.`, path:req.path}, req, res);
}
}

module.exports = function(cfg, db){
  config = cfg;
  database = db;
  return operationHandler
}
