const getData = require('../get-data')

exports.getTeachers = async (context, query = {}) => {
  query.type = 'teacher'
  return await getData(context, query)
}