const withTokenAuth = require('../lib/token-auth')
const { getSchool } = require('../lib/api/schools')
const { getStudents } = require('../lib/api/students')

const returnSchool = async function (context, req) {
  const caller = req.token.caller
  const { schoolId } = context.bindingData

  try {
    const schools = await getSchool(context, schoolId)
    const students = await getStudents(context, {
      schoolIds: schools[0].id
    })

    context.log.info(['api', 'school', schoolId, 'students', caller, 'length', students.length])
    context.res = {
      body: students
    }
  } catch (error) {
    context.log.error(['api', 'school', schoolId, 'students', caller, 'error', error.message])
    context.res = {
      status: 500,
      body: error.message
    }
  }
}

module.exports = (context, request) => withTokenAuth(context, request, returnSchool)
