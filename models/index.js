//@ts-check
const { Investor } = require('./Investor');
const { Company } = require('./Company');
const { Market } = require('./Market');
const mongoose = require('mongoose');

module.exports = { Investor, Company, Market, mongoose };