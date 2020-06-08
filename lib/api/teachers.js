const getData = require('../get-data')

exports.getTeachers = async (context, query = {}) => {
  query.type = 'teacher'
  return await getData(context, query)
}

exports.getTeacher = async (context, id) => {
  const query = { type: 'teacher' }

  // Check if the ID is numeric
  if(!isNaN(id)) {
    query.id = id
  } else if(id.includes('@')) {
    query.email = id
  } else {
    query.username = id
  }

  return await getData(context, query)
}