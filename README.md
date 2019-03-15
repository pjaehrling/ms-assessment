# ms-assessment
## How to run:
- install dependencies: `npm install` (installs `serverless-offline`)
- run the code: `sls offline start`

## Endpoints:
### List each variable value in the specified range
- `/list?field={fieldname}&start={start-date}&end={end-date}`
- `/mean?field={fieldname}&start={start-date}&end={end-date}`

## Infos:
- Both endoints could be unified into one, using an additional query-parameter, but since they both return a different kind of result (single value vs. list of values) I decided to keep them seperate
- To make this solution more robust it would be possible to further validate the query-parameters:
  - make sure the start and end date parameters can be parsed to a valid date (either using a regular expression or checking the result of `new Date(param)`)
  - make sure the field name is actually a valid field (part of a weather data entry)  
  - make sure the start date is smaller than the end date

## How to make this solution scalable:
- Make use of the fact, that the weather data is sorted by date and not go through the whole list from start to end. Can be done by using a binary search, with the extend to find an approximate match. In this case use the predecessor (next-smallest element) for the start index and successor (next-largest element) for the end index.
- Load data from a DB, should be faster than reading from a file and could save parsing (to date or float). In case a relational DB is could be used (amount of data isn't too big), filtering the data and "reducing" fields would be done in the query. To speed up the query an index should be set on the "datetime" field.