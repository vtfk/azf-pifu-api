const { getFirst, getData } = require('../get-data')

exports.getStudents = async (context, query = {}) => {
  query.type = 'student'
  return await getData(context, query)
}

exports.getStudent = async (context, id) => {
  const query = { type: 'student' }

  // Check if the ID is numeric
  if (!isNaN(id)) {
    query.id = id
  } else if (id.includes('@')) {
    query.email = id
  } else {
    query.username = id
  }

  return await getFirst(context, query)
}
