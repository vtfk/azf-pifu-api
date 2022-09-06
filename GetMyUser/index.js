const { logger } = require('@vtfk/logger')
const withTokenAuth = require('../lib/token-auth')
const { getStudent } = require('../lib/api/students')
const { getTeacher } = require('../lib/api/teachers')
const repackStudent = require('../lib/repack-student-me')
const repackTeacher = require('../lib/repack-teacher')

const returnUser = async function (context, req) {
  const { caller, type } = req.token
  // Verify that we got a caller and a calling type!
  if (!caller || !type) {
    context.res = {
      status: 401,
      body: 'Couldn\'t read caller and/or type from token!'
    }
    return
  }

  try {
    // Get teacher from caller
    if (type === 'teacher') {
      const teacher = await getTeacher(context, caller)
      if (!teacher) {
        logger('warn', ['pifu-api', 'me', 'get user', 'teacher not found'])
        context.res = {
          status: 401,
          body: `Teacher not found: ${caller}`
        }
        return
      }

      const repackedTeacher = repackTeacher(context, teacher)
      context.res = {
        body: repackedTeacher
      }
    } else if (type === 'student') {
      const student = await getStudent(context, caller)
      if (!student) {
        logger('warn', ['pifu-api', 'me', 'get user', 'student not found'])
        context.res = {
          status: 401,
          body: `Student not found: ${caller}`
        }
        return
      }

      const repackedStudent = repackStudent(context, student)
      context.res = {
        body: repackedStudent
      }
    }
  } catch (error) {
    logger('error', ['pifu-api', 'me', 'get user', 'error', error.message])
    context.res = {
      status: 500,
      body: error.message
    }
  }
}

module.exports = (context, request) => withTokenAuth(context, request, returnUser)
