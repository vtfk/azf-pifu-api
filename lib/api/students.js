const getData = require('../get-data')

exports.getStudents = async (context, query = {}) => {
  query.type = 'student'
  return await getData(context, query)
}