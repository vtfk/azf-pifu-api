const { logger } = require('@vtfk/logger')
const withTokenAuth = require('../lib/token-auth')
const { getStudents } = require('../lib/api/students')
const { getTeacher } = require('../lib/api/teachers')
const repackStudent = require('../lib/repack-student')

const returnTeacherStudents = async function (context, req) {
  const { id } = context.bindingData

  try {
    // Get teacher matching the provided username
    const teacher = await getTeacher(context, id)
    if (!teacher) {
      logger('warn', ['pifu-api', 'teacher', 'get students', id, 'teacher not found', id])
      context.res = {
        status: 403,
        body: `Teacher not found: ${id}`
      }
      return
    }

    // Get teachers matching the teacher class ids
    const students = await getStudents(context, {
      groupIds: { $in: [...teacher.groupIds] }
    })

    logger('info', ['pifu-api', 'teacher', 'get students', students.length])
    const repackedStudents = students.map((student) => repackStudent(context, student, teacher))
    context.res = {
      body: repackedStudents
    }
  } catch (error) {
    logger('error', ['pifu-api', 'teacher', 'get students', 'error', error.message])
    context.res = {
      status: 500,
      body: error.message
    }
  }
}

module.exports = (context, request) => withTokenAuth(context, request, returnTeacherStudents)
