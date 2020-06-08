const { getData, getFirst } = require('../get-data')

exports.getSchools = async (context) => {
  const query = { type: 'skole' }
  const schools = await getData(context, query)
  return schools && schools.length > 0 ? schools : []
}

exports.getSchool = async (context, schoolId) => {
  const query = { type: 'skole', schoolId }
  return await getFirst(context, query)
}
