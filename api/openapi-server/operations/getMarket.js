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
  let {id} = req.params;
  let market = await database.readMarket({_id:id});
  success(market, req, res);
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
