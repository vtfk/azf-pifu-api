const withTokenAuth = require('../lib/token-auth')
const { getClass } = require('../lib/api/classes')
const { getTeacher } = require('../lib/api/teachers')
const repackClasses = require('../lib/repack-class-members')

const returnClass = async function (context, req) {
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
      context.log.warn(['pifu-api', 'classes', caller, 'get class', id, 'teacher not found'])
      context.res = {
        status: 401,
        body: `Teacher not found: ${caller}`
      }
      return
    }

    const classes = await getClass(context, id)
    if (!classes) {
      context.log.warn(['pifu-api', 'classes', caller, 'get class', id, 'class not found'])
      context.res = {
        status: 403,
        body: []
      }
      return
    }

    if (!teacher.groupIds.includes(classes.id)) {
      context.log(['pifu-api', 'classes', caller, 'get class', id, 'teacher not related to group, but returning groups with hidden members'])

      const repackedClass = repackClasses(classes)
      context.res = {
        body: [repackedClass]
      }
      return
    }

    context.log.info(['pifu-api', 'class', id, caller, 'id', classes.id])
    context.res = {
      body: [classes]
    }
  } catch (error) {
    context.log.error(['pifu-api', 'class', id, caller, 'error', error.message])
    context.res = {
      status: 500,
      body: error.message
    }
  }
}

module.exports = (context, request) => withTokenAuth(context, request, returnClass)
