import express from 'express';
import { initialize } from 'express-openapi';
import yamljs from 'yamljs';
import bodyParser from 'body-parser';

const app = express();

const defaultParameters = 
{
  errorMiddleware: function(err, req, res, next) { res.status(err.status); res.send(err); },
  logger: console
}

var _parameters;

function validateAllResponses(req, res, next) {
  const strictValidation = req.apiDoc['x-express-openapi-validation-strict'] ? true : false;
  if (typeof res.validateResponse === 'function') {
      const send = res.send;
      res.send = function expressOpenAPISend(...args) {
        const onlyWarn = !strictValidation;
        if (res.get('x-express-openapi-validation-error-for') !== undefined || this.validated) {
            return send.apply(res, args);
        }
        const body = args[0];
        // _parameters.logger.warn('test1');
        // _parameters.logger.warn(typeof(body));
        // _parameters.logger.warn(body);
        let validation = res.validateResponse(res.statusCode, body);
        // _parameters.logger.warn('test2');
        // _parameters.logger.warn(typeof(body));
        // _parameters.logger.warn(body);
        
        let errorObj;
        let validationMessage;
        if (validation === undefined) {
            validation = { message: undefined, errors: undefined };
        }
        if (validation.errors) {
            const errorList = Array.from(validation.errors).map(_ => _.message).join(',');
            validationMessage = `Invalid response for status code ${res.statusCode}: ${errorList}`;
            errorObj = { error: validationMessage, ...validation }
            // Set to avoid a loop, and to provide the original status code
            res.set('x-express-openapi-validation-error-for', res.statusCode.toString());
        }
        // let internalErrorObj = Arrays.from(validation.errors).map(error=>error.path="test")
        if (onlyWarn || !validation.errors) {
            if(validation.errors) //if there actually were validation errors
              _parameters.logger.warn(validationMessage, errorObj);
            
            this.validated = true; //validation has occurred on thisrequest (ignores further internal .send calls)
            return send.apply(res, args);
        } else {
            _parameters.logger.error(validationMessage, errorObj);
            this.validated = true; //validation has occurred on thisrequest (ignores further internal .send calls)
            res.status(500);
            return res.json({ status:500, error: validationMessage, ...validation });
        }
    }
  }
  next();
}

function parseApiDoc(apiDoc){
  if (typeof(apiDoc) === 'string')
    return yamljs.load(apiDoc);
  return apiDoc;
}

function adjustParameters(app, parameters){
  //applying default parameters and overwriting with supplied params
  let finalParams = defaultParameters;
  Object.assign(finalParams, parameters);
  finalParams.app=app;

  //applying responseValidation params as vendorExtensions
  switch(finalParams.responseValidation){
    case 'warn':
      finalParams.vendorExtensions = 
        { //add validation vendorExtenasion (enables response validation in warning mode)
          ...{ 'x-express-openapi-additional-middleware': [validateAllResponses] },
          ...finalParams.vendorExtensions
        }
      break;
    case 'strict':
      finalParams.vendorExtensions = 
        { //add validation vendorExtenasion (enables response validation in strict mode)
          ...{ 'x-express-openapi-additional-middleware': [validateAllResponses], 'x-express-openapi-validation-strict': true },
          ...finalParams.vendorExtensions
        }
      break;
    default:
      throw new Error('init parameter responseValidation must be  one of: "strict", "warn")');
  }

  //normalizing api to json format and applying global vendor extensions to apiDOc
  finalParams.apiDoc = 
    { 
      ...parseApiDoc(finalParams.apiDoc),
      ...finalParams.vendorExtensions
    };
  return finalParams;
}

app.init = function(parameters){
  // let useParam = bodyParser.json({ type: 'application/json' });
  // let ogParse = useParam
  // useParam = function(...args){
  //   console.log('parsing that booty:', args[0]);
  //   ogParse.apply(useParam, args)
  // }
  // app.use(useParam);
  app.use(bodyParser.json({ type: 'application/json' }));

  //install custom middleware
  if(parameters.middleware)
    parameters.middleware.forEach(middleware => {
      app.use(middleware);
    });

  parameters = adjustParameters(app, parameters);
  _parameters = parameters;
  initialize(parameters);
}

module.exports = app;