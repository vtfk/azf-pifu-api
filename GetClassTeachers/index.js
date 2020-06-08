const withTokenAuth = require('../lib/token-auth')
const { getClass } = require('../lib/api/classes')
const { getTeachers } = require('../lib/api/teachers')
const repackTeacher = require('../lib/repack-teacher')

const returnClasses = async function (context, req) {
  const caller = req.token.caller
  const { id } = context.bindingData

  try {
    const classes = await getClass(context, id)
    if(!classes) {
      context.res = {
        status: 404,
        body: `Class not found: ${id}`
      }
      return
    }

    const teachers = await getTeachers(context, { groupIds: classes.id })
    context.log.info(['pifu-api', 'class', id, 'teachers', caller, 'length', teachers.length])
    
    const repackedTeachers = teachers.map((teacher) => repackTeacher(context, teacher))
    context.res = {
      body: repackedTeachers
    }
  } catch (error) {
    context.log.error(['pifu-api', 'class', id, 'teachers', caller, 'error', error.message])
    context.res = {
      status: 500,
      body: error.message
    }
  }
}

module.exports = (context, request) => withTokenAuth(context, request, returnClasses)
