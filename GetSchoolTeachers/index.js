const withTokenAuth = require('../lib/token-auth')
const { getSchool } = require('../lib/api/schools')
const { getTeachers } = require('../lib/api/teachers')

const returnSchool = async function (context, req) {
  const caller = req.token.caller
  const { id } = context.bindingData

  try {
    const school = await getSchool(context, id)
    if(!school) {
      context.res = {
        status: 404,
        body: `School not found: ${id}`
      }
      return
    }

    const teachers = await getTeachers(context, { schoolIds: school.id })

    context.log.info(['api', 'school', id, 'teachers', caller, 'length', teachers.length])
    context.res = {
      body: teachers
    }
  } catch (error) {
    context.log.error(['api', 'school', id, 'teachers', caller, 'error', error.message])
    context.res = {
      status: 500,
      body: error.message
    }
  }
}

module.exports = (context, request) => withTokenAuth(context, request, returnSchool)
