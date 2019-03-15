'use strict';

const checkQueryParams = (params) => 
    params.hasOwnProperty('name') &&
    params.hasOwnProperty('start') && 
    params.hasOwnProperty('end');

module.exports.list = async (event, context) => {

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: checkQueryParams(event.queryStringParameters) ? 'list output' : 'missing query param',
      input: event,
    }),
  };
};

module.exports.mean = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: checkQueryParams(event.queryStringParameters) ? 'mean average output' : 'missing query param',
      input: event,
    }),
  };
};