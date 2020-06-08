const getData = require('../get-data')

exports.getSchools = async (context) => {
  const query = { type: 'skole' }
  return await getData(context, query)
}

exports.getSchool = async (context, schoolId) => {
  const query = { type: 'skole', schoolId }
  return await getData(context, query)
}