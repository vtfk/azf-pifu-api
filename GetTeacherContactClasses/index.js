const withTokenAuth = require('../lib/token-auth')
const { getTeacher } = require('../lib/api/teachers')
const { getClasses } = require('../lib/api/classes')

const returnTeacherStudents = async function (context, req) {
  const { caller } = req.token
  const { id } = context.bindingData

  try {
    // Get teacher matching the provided username
    const teacher = await getTeacher(context, id)
    if (!teacher) {
      context.log.warn(['pifu-api', 'teacher', caller, 'get contactclasses', 'teacher not found', id])
      context.res = {
        body: []
      }
      return
    }

    if (!teacher.groupIds || teacher.groupIds.length === 0) {
      context.log.warn(['pifu-api', 'teacher', caller, 'get contactclasses', 'teacher has no groups', id])
      context.res = {
        body: []
      }
      return
    }

    // Get basisgrupper the teacher is member of
    const classes = await getClasses(context, {
      memberIds: teacher.id
    })

    context.log(['pifu-api', 'teacher', caller, 'get contactclasses', classes.length])
    const classIds = classes.map(group => ({ Id: group.groupId }))
    context.res = {
      body: classIds
    }
  } catch (error) {
    context.log.error(['pifu-api', 'teacher', caller, 'get contactclasses', 'error', error.message])
    context.res = {
      status: 500,
      body: error.message
    }
  }
}

module.exports = (context, request) => withTokenAuth(context, request, returnTeacherStudents)
