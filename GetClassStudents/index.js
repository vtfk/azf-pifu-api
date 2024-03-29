const { logger } = require('@vtfk/logger')
const withTokenAuth = require('../lib/token-auth')
const { getClass } = require('../lib/api/classes')
const { getStudents } = require('../lib/api/students')
const { getTeacher } = require('../lib/api/teachers')
const { decode } = require('../lib/decode-uri-id')
const repackStudent = require('../lib/repack-student')

const returnClasses = async function (context, req) {
  const caller = req.token.caller
  const { id: rawId } = context.bindingData
  const id = decode(rawId)

  const { all } = req.query
  const noLimits = `${all}`.toLowerCase() === 'true'

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
    if (!noLimits && !teacher) {
      logger('warn', ['pifu-api', 'classes', 'students', id, 'teacher not found'])
      context.res = {
        status: 401,
        body: `Teacher not found: ${caller}`
      }
      return
    }

    const classes = await getClass(context, id)
    if (!classes) {
      logger('warn', ['pifu-api', 'classes', 'students', id, 'class not found'])
      context.res = {
        status: 403,
        body: []
      }
      return
    }

    const students = await getStudents(context, { groupIds: classes.id })
    logger('info', ['pifu-api', 'class', id, 'students', 'length', students.length])

    // If we want to get all users without current user restrictions, return everything
    if (noLimits) {
      const repackedStudents = students.map((student) => repackStudent(context, student))
      logger('info', ['pifu-api', 'class', id, 'students', 'returning all students without limitations'])
      context.res = { body: repackedStudents }
      return
    }

    // Get students the teacher have a relation to
    const teacherStudents = students.filter(student => student.groupIds && student.groupIds.includes(classes.id) && student.groupIds.some(groupId => teacher.groupIds.includes(groupId)))
    if (teacherStudents.length === 0 && !teacher.groupIds.includes(classes.id)) {
      logger('warn', ['pifu-api', 'classes', 'students', id, 'teacher not related to group'])
      context.res = {
        status: 403,
        body: []
      }
      return
    }

    const repackedStudents = students.map((student) => repackStudent(context, student, teacher))
    context.res = {
      body: repackedStudents
    }
  } catch (error) {
    logger('error', ['pifu-api', 'class', id, 'students', 'error', error.message])
    context.res = {
      status: 500,
      body: error.message
    }
  }
}

module.exports = (context, request) => withTokenAuth(context, request, returnClasses)
