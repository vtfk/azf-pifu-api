const withTokenAuth = require('../lib/token-auth')
const { getStudent } = require('../lib/api/students')
const { getTeacher } = require('../lib/api/teachers')
const { getClasses } = require('../lib/api/classes')
const repackClassMembers = require('../lib/repack-class-members')

const returnStudentClasses = async function (context, req) {
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
      context.log.warn(['pifu-api', 'student', caller, 'get student classes', id, 'teacher not found'])
      context.res = {
        status: 401,
        body: `Teacher not found: ${caller}`
      }
      return
    }

    // Get students matching the provided username
    const student = await getStudent(context, id)
    if (!student) {
      context.log.warn(['pifu-api', 'student', caller, 'get student classes', id, 'student not found', id])
      context.res = {
        status: 403,
        body: `Student not found: ${id}`
      }
      return
    }

    // Get student classes
    const studentGroupIds = student.groupIds || []
    const classes = await getClasses(context, {
      id: { $in: studentGroupIds },
      type: { $in: ['basisgruppe', 'undervisningsgruppe'] }
    }) || []

    context.log(['pifu-api', 'student', caller, 'get student classes', student.username, classes.length])
    const repackedGroups = classes.map(groups => repackClassMembers(groups))
    context.res = {
      body: repackedGroups
    }
  } catch (error) {
    context.log.error(['pifu-api', 'student', caller, 'get student classes', 'error', error.message])
    context.res = {
      status: 500,
      body: error.message
    }
  }
}

module.exports = (context, request) => withTokenAuth(context, request, returnStudentClasses)
