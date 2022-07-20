//@ts-check
const Database = require('../database');
const config = require('config');

let database = new Database(config.get('db'));

let companies = require('./data/companies.json');
let investors = require('./data/investors.json');
let markets = require('./data/markets.json');

(async ()=>{
  await database.deleteMarkets();
  await database.deleteInvestors();
  await database.deleteCompanies();
  await database.writeMarkets(markets);
  await database.writeCompanies(companies);
  await database.writeInvestors(investors);
  database.disconnect();
})();
