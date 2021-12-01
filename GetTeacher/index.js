const { logger } = require('@vtfk/logger')
const withTokenAuth = require('../lib/token-auth')
const { getTeacher } = require('../lib/api/teachers')
const repackTeacher = require('../lib/repack-teacher')

const returnTeacher = async function (context, req) {
  const { id } = context.bindingData

  try {
    // Get teacher matching the provided username
    const teacher = await getTeacher(context, id)
    if (!teacher) {
      logger('warn', ['pifu-api', 'teacher', 'get teacher', id, 'teacher not found', id])
      context.res = {
        status: 403,
        body: `Teacher not found: ${id}`
      }
      return
    }

    logger('info', ['pifu-api', 'teacher', 'get teacher', teacher.username])
    const repackedTeacher = repackTeacher(context, teacher)
    context.res = {
      body: [repackedTeacher]
    }
  } catch (error) {
    logger('error', ['pifu-api', 'teacher', 'get teacher', 'error', error.message])
    context.res = {
      status: 500,
      body: error.message
    }
  }
}

module.exports = (context, request) => withTokenAuth(context, request, returnTeacher)
