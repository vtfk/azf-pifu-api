const { logger } = require('@vtfk/logger')
const withTokenAuth = require('../lib/token-auth')
const repackClasses = require('../lib/repack-class-members')
const { getTeacher } = require('../lib/api/teachers')
const { getClasses } = require('../lib/api/classes')

const returnClasses = async function (context, req) {
  const { caller } = req.token

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
      logger('warn', ['pifu-api', 'my-classes', 'teacher not found'])
      context.res = {
        status: 403,
        body: `Teacher not found: ${caller}`
      }
      return
    }

    if (!teacher.groupIds || teacher.groupIds.length === 0) {
      logger('warn', ['pifu-api', 'my-classes', 'teacher has no group'])
      context.res = {
        body: []
      }
      return
    }

    // Get classes matching teacher groupIds
    const classes = await getClasses(context, {
      id: { $in: teacher.groupIds },
      type: { $in: ['basisgruppe', 'undervisningsgruppe'] }
    })

    logger('info', ['pifu-api', 'my-classes', 'classes', classes.length])

    const repackedClasses = classes.map(repackClasses)
    context.res = {
      body: repackedClasses
    }
  } catch (error) {
    logger('error', ['pifu-api', 'my-classes', 'error', error.message])
    context.res = {
      status: 500,
      body: error.message
    }
  }
}

module.exports = (context, request) => withTokenAuth(context, request, returnClasses)
