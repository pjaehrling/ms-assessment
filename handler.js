'use strict';
const fs = require('fs');

// Default response in case a query param is missing
const missingParamResponse = {
  statusCode: 400,
  body: JSON.stringify({
    message: 'missing query param (required: field, start, end)',
  })
};

/**
 * Check if all required query params are set 
 * @param {Object} params 
 */
const checkQueryParams = (p) => 
  p.hasOwnProperty('field') &&
  params.hasOwnProperty('start') &&
  params.hasOwnProperty('end');

// Load weather data from file
// Outside of handler function, to save "reading"-time in case the container is reused
const weatherData = JSON.parse(fs.readFileSync('data.json', 'utf8'))

/**
 * Filters the data to fit a given time range and reduces it to the requested field.
 * 
 * @param {Array} data 
 * @param {String} fieldName 
 * @param {Date} startDate 
 * @param {Date} endDate 
 * @returns {Array} filtered to fit the provided time range and reduced to the requested field
 */
const getFieldValuesInRange = (data, fieldName, startDate, endDate) => {
  return data.filter((entry) => {
    const entryDate = new Date(entry.datetime);
    return (entryDate >= startDate && entryDate <= endDate);
  }).map((entry) => entry[fieldName]);
}

/**
 * "/list" endpoint handler function
 */
module.exports.list = async (event) => {
  const qp = event.queryStringParameters;
  if (!checkQueryParams(qp)) return missingParamResponse;
  
  const startDate = new Date(qp.start);
  const endDate = new Date(qp.end);
  const result = getFieldValuesInRange(weatherData, qp.field, startDate, endDate);
  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};

/**
 * "/mean" endpoint handler function
 */
module.exports.mean = async (event) => {
  const qp = event.queryStringParameters;
  if (!checkQueryParams(qp)) return missingParamResponse;

  const startDate = new Date(qp.start);
  const endDate = new Date(qp.end);
  const filtered = getFieldValuesInRange(weatherData, qp.field, startDate, endDate);
  const sum = filtered.reduce((total, current) => total + parseFloat(current), 0);
  const result = sum / filtered.length;
  return {
    statusCode: 200,
    body: JSON.stringify({ meanAverage: result })
  };
};