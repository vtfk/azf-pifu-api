const withTokenAuth = require('../lib/token-auth')
const { getTeacher } = require('../lib/api/teachers')
const repackTeacher = require('../lib/repack-teacher')

const returnTeacher = async function (context, req) {
  const { caller } = req.token
  const { id } = context.bindingData

  try {
    // Get teacher matching the provided username
    const teacher = await getTeacher(context, id)
    if (!teacher) {
      context.log.warn(['pifu-api', 'teacher', caller, 'get teacher', id, 'teacher not found', id])
      context.res = {
        status: 404,
        body: `Teacher not found: ${id}`
      }
      return
    }

    context.log(['pifu-api', 'teacher', caller, 'get teacher', teacher.username])
    const repackedTeacher = repackTeacher(context, teacher)
    context.res = {
      body: [repackedTeacher]
    }
  } catch (error) {
    context.log.error(['pifu-api', 'teacher', caller, 'get teacher', 'error', error.message])
    context.res = {
      status: 500,
      body: error.message
    }
  }
}

module.exports = (context, request) => withTokenAuth(context, request, returnTeacher)
