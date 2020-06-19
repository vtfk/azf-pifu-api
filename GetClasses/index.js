const withTokenAuth = require('../lib/token-auth')
const { getClasses } = require('../lib/api/classes')
const repackClasses = require('../lib/repack-class-members')

const returnClasses = async function (context, req) {
  const caller = req.token.caller

  try {
    const classes = await getClasses(context)
    if (!classes || classes.length <= 0) {
      context.res = {
        status: 403,
        body: 'No classes found.'
      }
      return
    }

    context.log.info(['pifu-api', 'classes', caller, 'length', classes.length])

    const repackedClasses = classes.map(repackClasses)
    context.res = {
      body: repackedClasses
    }
  } catch (error) {
    context.log.error(['pifu-api', 'classes', caller, 'error', error.message])
    context.res = {
      status: 500,
      body: error.message
    }
  }
}

module.exports = (context, request) => withTokenAuth(context, request, returnClasses)
