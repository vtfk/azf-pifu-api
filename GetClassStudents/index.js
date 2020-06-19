const withTokenAuth = require('../lib/token-auth')
const { getClass } = require('../lib/api/classes')
const { getStudents } = require('../lib/api/students')
const repackStudent = require('../lib/repack-student')
const { getTeacher } = require('../lib/api/teachers')

const returnClasses = async function (context, req) {
  const caller = req.token.caller
  const { id } = context.bindingData

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
      context.log.warn(['pifu-api', 'classes', caller, 'students', id, 'teacher not found'])
      context.res = {
        status: 401,
        body: `Teacher not found: ${caller}`
      }
      return
    }

    const classes = await getClass(context, id)
    if (!classes) {
      context.log.warn(['pifu-api', 'classes', caller, 'students', id, 'class not found'])
      context.res = {
        status: 403,
        body: []
      }
      return
    }

    const students = await getStudents(context, { groupIds: classes.id })
    context.log.info(['pifu-api', 'class', id, 'students', caller, 'length', students.length])

    // Get students the teacher have relation
    const teacherStudents = students.filter(student => student.groupIds && student.groupIds.includes(classes.id) && student.groupIds.some(groupId => teacher.groupIds.includes(groupId)))

    if (teacherStudents.length === 0 && !teacher.groupIds.includes(classes.id)) {
      context.log.warn(['pifu-api', 'classes', caller, 'students', id, 'teacher not related to group'])
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
    context.log.error(['pifu-api', 'class', id, 'students', caller, 'error', error.message])
    context.res = {
      status: 500,
      body: error.message
    }
  }
}

module.exports = (context, request) => withTokenAuth(context, request, returnClasses)
