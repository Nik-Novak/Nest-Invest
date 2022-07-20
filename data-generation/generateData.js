//@ts-check
const fs = require('fs');
const moment = require('moment').utc;
const config = require('config');
const chance = require('chance')();
const bson = require('bson');

function twoDecimals(num) {
  return Math.floor(num * 100) / 100;
}

function getRandomId(collection){
  let randomIndex = Math.floor(Math.random() * collection.length);
  // console.log(randomIndex, collection);
  return collection[randomIndex]._id;
}

const numInvestors = config.get('num_investors');
const numCompanies = config.get('num_companies');
const maxCompaniesPerInvestor = config.get('max_companies_per_investor');

function generateInvestorsFile(filepath, companies){
  fs.writeFileSync(filepath, '[\n');
  
  for(let i=0; i<numInvestors; i++){
    let randomInvestorId = new bson.ObjectID();
    let randomFirstName = chance.first();
    let randomLastName = chance.last();
    let numCompanies = 1 + Math.floor(Math.random() * maxCompaniesPerInvestor);
    let ownedCompanyIds= [];
    for(let i=0; i<numCompanies; i++){
      let randomCompanyId = getRandomId(companies);
      ownedCompanyIds.push(randomCompanyId);
    }
    let row={
      _id: randomInvestorId,
      first_name: randomFirstName,
      last_name: randomLastName,
      company_ids: ownedCompanyIds
    };
    fs.appendFileSync(filepath, JSON.stringify(row) + (i==numInvestors-1 ? '':',\n') );
  };
  fs.appendFileSync(filepath, '\n]');
}

function generateMarkets(filepath){
  const markets = [
    { '_id': new bson.ObjectID(), 'name': 'Ecommerce', 'parent_id': 7 },
    { '_id': new bson.ObjectID(), 'name': 'Insurtech', 'parent_id': 8 },
    { '_id': new bson.ObjectID(), 'name': 'Enterprise', 'parent_id': null },
    { '_id': new bson.ObjectID(), 'name': 'Banking', 'parent_id': 8 },
    { '_id': new bson.ObjectID(), 'name': 'Social', 'parent_id': 7 },
    { '_id': new bson.ObjectID(), 'name': 'Banking as a Service', 'parent_id': 4 },
    { '_id': new bson.ObjectID(), 'name': 'Consumer', 'parent_id': null },
    { '_id': new bson.ObjectID(), 'name': 'Finance', 'parent_id': null },
  ];
  let marketsWithMappedIds = markets.map(market=>{
    let marketIndex = market.parent_id;
    if(marketIndex===null)
      return market;
    marketIndex = marketIndex - 1;
    let mappedId = markets[marketIndex]._id;
    return { ...market, parent_id: mappedId };
  });
  fs.writeFileSync(filepath, JSON.stringify(marketsWithMappedIds, null, 2) );
  return marketsWithMappedIds;
}

function generateCompaniesFile(filepath, markets){
  let companies = [];
  fs.writeFileSync(filepath, '[\n');
  for(let i=0; i<numCompanies; i++){
    let randomCompanyId = new bson.ObjectID();
    let randomMarketId = getRandomId(markets);
    let row = {
      _id: randomCompanyId,
      name: chance.company(),
      address: chance.address(),
      market_tag_id: randomMarketId
    };
    companies.push(row);
    fs.appendFileSync(filepath, JSON.stringify(row) + (i==numCompanies-1 ? '':',\n') );
  };
  fs.appendFileSync(filepath, '\n]');
  return companies;
}

let markets = generateMarkets('./data/markets.json');
let companies = generateCompaniesFile('./data/companies.json', markets);
generateInvestorsFile('./data/investors.json', companies);