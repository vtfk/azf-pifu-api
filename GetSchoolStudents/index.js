const withTokenAuth = require('../lib/token-auth')
const { getSchool } = require('../lib/api/schools')
const { getStudents } = require('../lib/api/students')
const repackStudent = require('../lib/repack-student')

const returnSchool = async function (context, req) {
  const caller = req.token.caller
  const { id } = context.bindingData

  try {
    const school = await getSchool(context, id)
    if (!school) {
      context.res = {
        status: 404,
        body: `School not found: ${id}`
      }
      return
    }

    const students = await getStudents(context, { schoolIds: school.id })

    context.log.info(['pifu-api', 'school', id, 'students', caller, 'length', students.length])

    const repackedStudents = students.map((student) => repackStudent(context, student))
    context.res = {
      body: repackedStudents
    }
  } catch (error) {
    context.log.error(['pifu-api', 'school', id, 'students', caller, 'error', error.message])
    context.res = {
      status: 500,
      body: error.message
    }
  }
}

module.exports = (context, request) => withTokenAuth(context, request, returnSchool)
