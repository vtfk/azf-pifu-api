const { logger } = require('@vtfk/logger')
const withTokenAuth = require('../lib/token-auth')
const { getClasses } = require('../lib/api/classes')
const repackClasses = require('../lib/repack-class-members')

const returnClasses = async function (context, req) {
  try {
    const classes = await getClasses(context)
    if (!classes || classes.length <= 0) {
      context.res = {
        status: 403,
        body: 'No classes found.'
      }
      return
    }

    logger('info', ['pifu-api', 'classes', 'length', classes.length])

    const repackedClasses = classes.map(repackClasses)
    context.res = {
      body: repackedClasses
    }
  } catch (error) {
    logger('error', ['pifu-api', 'classes', 'error', error.message])
    context.res = {
      status: 500,
      body: error.message
    }
  }
}

module.exports = (context, request) => withTokenAuth(context, request, returnClasses)
