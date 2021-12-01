const { logger } = require('@vtfk/logger')
const withTokenAuth = require('../lib/token-auth')
const { getStudent } = require('../lib/api/students')
const { getTeacher } = require('../lib/api/teachers')
const repackStudent = require('../lib/repack-student')

const returnStudents = async function (context, req) {
  const { caller } = req.token
  const { id } = context.bindingData

  // Verify that we got a caller!
  if (!caller) {
    context.res = {
      status: 401,
      body: 'Couldn\'t read caller from token!'
    }
    return
  }

  try {
    // Get teacher
    const teacher = await getTeacher(context, caller)
    if (!teacher) {
      logger('warn', ['pifu-api', 'student', 'get student', id, 'teacher not found'])
      context.res = {
        status: 401,
        body: `Teacher not found: ${caller}`
      }
      return
    }

    // Get students matching the provided username
    const student = await getStudent(context, id)
    if (!student) {
      logger('warn', ['pifu-api', 'student', 'get student', id, 'student not found', id])
      context.res = {
        status: 403,
        body: `Student not found: ${id}`
      }
      return
    }

    // Get intersecting groups between student and teacher
    const studentGroupIds = student.groupIds || []
    const teacherGroupIds = teacher.groupIds || []
    const commonGroupIds = [...teacherGroupIds].filter(groupId => studentGroupIds.includes(groupId))

    // No - this aint my student!
    if (commonGroupIds.length === 0) {
      logger('info', ['pifu-api', 'student', 'get student', id, 'student not related to teacher'])
      context.res = {
        status: 403,
        body: []
      }
      return
    }

    logger('info', ['pifu-api', 'student', 'get student', student.username])
    const repackedStudent = repackStudent(context, student, teacher)
    context.res = {
      body: [repackedStudent]
    }
  } catch (error) {
    logger('error', ['pifu-api', 'student', 'get student', 'error', error.message])
    context.res = {
      status: 500,
      body: error.message
    }
  }
}

module.exports = (context, request) => withTokenAuth(context, request, returnStudents)
