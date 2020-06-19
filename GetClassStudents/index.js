const withTokenAuth = require('../lib/token-auth')
const { getClass } = require('../lib/api/classes')
const { getStudents } = require('../lib/api/students')
const repackStudent = require('../lib/repack-student')

const returnClasses = async function (context, req) {
  const caller = req.token.caller
  const { id } = context.bindingData

  try {
    const classes = await getClass(context, id)
    if (!classes) {
      context.res = {
        status: 403,
        body: `Class not found: ${id}`
      }
      return
    }

    const students = await getStudents(context, { groupIds: classes.id })
    context.log.info(['pifu-api', 'class', id, 'students', caller, 'length', students.length])

    const repackedStudents = students.map((student) => repackStudent(context, student))
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
