const path = require('path');
const fs = require('fs');

let config;

let operationHandler = function(req, res){
  console.log('Executing Operation: ' + path.relative(process.cwd(),__filename));
  res.status(200);
  // let url = config.get('protocol') + '://' + req.hostname + ':' + config.get('port')
  res.render('Redoc.html');// res.render('Redoc.html', {specUrl: url + '/api-docs'})
}

module.exports = function(cfg){
  config = cfg;
  return operationHandler
}