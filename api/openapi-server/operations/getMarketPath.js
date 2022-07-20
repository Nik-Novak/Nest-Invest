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
  let { id } = req.params;
  console.log(id);
  let startMarket = await database.readMarket({_id:id});
  let traversedIdsObj = {};
  let traversed_markets = [];
  let market = startMarket;
  while(market.parent_id !== null){
    console.log(market);
    let currentId = market._id;
    let nextJumpId = market.parent_id;
    if(traversedIdsObj[currentId])
      throw "A cycle was detected, which would have caused infinite path traversal";
      traversedIdsObj[currentId] = true;
    traversed_markets.push(market);
    market = await database.readMarket({_id: nextJumpId});
    console.log('new market fetched');
    // await database.updateMarket({_id: currentId}, { root_id: nextJumpId }); //update the root shortcut field
    console.log('done iter');
  }
  let root_id = market._id;
  let traversedIds = Object.keys(traversedIdsObj);
  // await database.updateMarkets({_id: {$in:traversedIds}, root_id: { $ne:root_id }}, {root_id}); //update all traversed nodes with correct root id
  traversed_markets.push(market);
  success(traversed_markets, req, res);
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
