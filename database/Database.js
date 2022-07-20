//@ts-check
const fs = require('fs');
const path = require('path');
const { mongoose, Investor, Company, Market } = require('../models');


class Database {
  #path; //#options;
  constructor(path, options={}){
    this.#path=path; //this.#options=options;
    mongoose.connect(path);
    mongoose.connection
      .once('open', function(){
        console.log('Connected to DB');
      })
      .on('error',function(err){
        console.log('Failed to connect to DB: ');
        console.error(err);
      });
  }

  disconnect(){
    return mongoose.disconnect();
  }

  // async getCompaniesByMarketIds(marketIds){
  //   let markets = await Market.find({_id:{$in:marketIds}});
  //   let companyIds = [];
  //   investors.forEach(fr=>companyIds.push(...fr.company_ids));
  //   return await Company.find({_id:{$in:companyIds}});
  // }

  readCompanies(query={}){
    return Company.find(query);
  }
  async writeCompanies(companies){
    let promisedWrites = companies.map(
      company=>{
        let model = new Company(company);
        return model.save();
      }
    );
    await Promise.all(promisedWrites);
  }
  async deleteCompanies(query={}){
    await Company.deleteMany(query);
  }

  async readInvestors(query={}){
    let data = await Investor.find(query);
    return data;
  }
  readInvestor(query={}, config={populate:''}){
    let request = Investor.findOne(query);
    if(config.populate)
      request.populate(config.populate);
    return request;
  }
  async writeInvestors(investors){
    let promisedWrites = investors.map(
      investor=>{
        let model = new Investor(investor);
        return model.save();
      }
    );
    await Promise.all(promisedWrites);
  }
  async deleteInvestors(query={}){
    await Investor.deleteMany(query);
  }

  readMarkets(query={}){
    return Market.find(query);
  }
  readMarket(query={}){
    return Market.findOne(query);
  }
  updateMarket(query={}, update={}){
    return Market.updateOne(query, update);
  }
  updateMarkets(query={}, update={}){
    return Market.updateMany(query, update);
  }
  async writeMarkets(sales){
    let promisedWrites = sales.map(
      sale=>{
        let model = new Market(sale);
        return model.save();
      }
    );
    await Promise.all(promisedWrites);
  }
  async deleteMarkets(query={}){
    await Market.deleteMany(query);
  }

}

module.exports = Database;