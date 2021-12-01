const { logger } = require('@vtfk/logger')
const withTokenAuth = require('../lib/token-auth')
const { getSchool } = require('../lib/api/schools')
const { getTeachers } = require('../lib/api/teachers')
const repackTeacher = require('../lib/repack-teacher')

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

    const teachers = await getTeachers(context, { schoolIds: school.id })
    logger('info', ['pifu-api', 'school', id, 'teachers', 'length', teachers.length])

    const repackedTeachers = teachers.map((teacher) => repackTeacher(context, teacher))
    context.res = {
      body: repackedTeachers
    }
  } catch (error) {
    logger('error', ['pifu-api', 'school', id, 'teachers', 'error', error.message])
    context.res = {
      status: 500,
      body: error.message
    }
  }
}

module.exports = (context, request) => withTokenAuth(context, request, returnSchool)
