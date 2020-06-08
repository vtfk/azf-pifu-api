const withTokenAuth = require('../lib/token-auth')
const { getSchool } = require('../lib/api/schools')
const { getTeachers } = require('../lib/api/teachers')

const returnSchool = async function (context, req) {
  const caller = req.token.caller
  const { schoolId } = context.bindingData

  try {
    const schools = await getSchool(context, schoolId)
    const teachers = await getTeachers(context, {
      schoolIds: schools[0].id
    })

    context.log.info(['api', 'school', schoolId, 'teachers', caller, 'length', teachers.length])
    context.res = {
      body: teachers
    }
  } catch (error) {
    context.log.error(['api', 'school', schoolId, 'teachers', caller, 'error', error.message])
    context.res = {
      status: 500,
      body: error.message
    }
  }
}

module.exports = (context, request) => withTokenAuth(context, request, returnSchool)
