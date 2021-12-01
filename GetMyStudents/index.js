const { logger } = require('@vtfk/logger')
const withTokenAuth = require('../lib/token-auth')
const { getStudents } = require('../lib/api/students')
const { getTeacher } = require('../lib/api/teachers')
const repackStudent = require('../lib/repack-student')

const returnStudents = async function (context, req) {
  const { caller } = req.token
  const name = req.query.name || '*'

  // Verify that we got a caller!
  if (!caller) {
    context.res = {
      status: 401,
      body: 'Couldn\'t read caller from token!'
    }
    return
  }

  try {
    // Get teacher from caller
    const teacher = await getTeacher(context, caller)
    if (!teacher) {
      logger('warn', ['pifu-api', 'my-students', 'teacher not found'])
      context.res = {
        status: 403,
        body: `Teacher not found: ${caller}`
      }
      return
    }

    if (!teacher.groupIds || teacher.groupIds.length === 0) {
      logger('warn', ['pifu-api', 'my-students', 'teacher has no group'])
      context.res = {
        body: []
      }
      return
    }

    // Get students matching search and teacher classes
    const students = await getStudents(context, {
      fullName: { $regex: name.replace('*', '.*'), $options: 'i' },
      groupIds: { $in: teacher.groupIds }
    })

    logger('info', ['pifu-api', 'my-students', 'search', name, 'students', students.length])

    const repackedStudents = students.map((student) => repackStudent(context, student, teacher))
    context.res = {
      body: repackedStudents
    }
  } catch (error) {
    logger('error', ['pifu-api', 'my-students', 'search', name, 'error', error.message])
    context.res = {
      status: 500,
      body: error.message
    }
  }
}

module.exports = (context, request) => withTokenAuth(context, request, returnStudents)
