const { logger } = require('@vtfk/logger')
const withTokenAuth = require('../lib/token-auth')
const { getClass } = require('../lib/api/classes')
const { getTeacher } = require('../lib/api/teachers')
const { decode } = require('../lib/decode-uri-id')
const repackClasses = require('../lib/repack-class-members')

const returnClass = async function (context, req) {
  const caller = req.token.caller
  const { id: rawId } = context.bindingData
  const id = decode(rawId)

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
    const classes = await getClass(context, id)
    if (!classes) {
      logger('warn', ['pifu-api', 'classes', 'get class', id, 'class not found'])
      context.res = {
        status: 403,
        body: []
      }
      return
    }

    if (!teacher || !teacher.groupIds.includes(classes.id)) {
      logger('info', ['pifu-api', 'classes', 'get class', id, 'teacher not related to group, but returning groups with hidden members'])

      const repackedClass = repackClasses(classes)
      context.res = {
        body: [repackedClass]
      }
      return
    }

    logger('info', ['pifu-api', 'class', id, 'id', classes.id])
    context.res = {
      body: [classes]
    }
  } catch (error) {
    logger('error', ['pifu-api', 'class', id, 'error', error.message])
    context.res = {
      status: 500,
      body: error.message
    }
  }
}

module.exports = (context, request) => withTokenAuth(context, request, returnClass)
