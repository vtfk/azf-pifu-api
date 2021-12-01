const { logger } = require('@vtfk/logger')
const withTokenAuth = require('../lib/token-auth')
const { getSchool } = require('../lib/api/schools')
const { getStudents } = require('../lib/api/students')
const repackStudent = require('../lib/repack-student')

const returnSchool = async function (context, req) {
  const { id } = context.bindingData

  try {
    const school = await getSchool(context, id)
    if (!school) {
      context.res = {
        status: 403,
        body: `School not found: ${id}`
      }
      return
    }

    const students = await getStudents(context, { schoolIds: school.id })

    logger('info', ['pifu-api', 'school', id, 'students', 'length', students.length])

    const repackedStudents = students.map((student) => repackStudent(context, student))
    context.res = {
      body: repackedStudents
    }
  } catch (error) {
    logger('error', ['pifu-api', 'school', id, 'students', 'error', error.message])
    context.res = {
      status: 500,
      body: error.message
    }
  }
}

module.exports = (context, request) => withTokenAuth(context, request, returnSchool)
