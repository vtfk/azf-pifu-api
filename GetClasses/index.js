const withTokenAuth = require('../lib/token-auth')
const { getClasses } = require('../lib/api/classes')

const returnClasses = async function (context, req) {
  const caller = req.token.caller

  try {
    const classes = await getClasses(context)
    if(!classes || classes.length <= 0) {
      context.res = {
        status: 404,
        body: `No classes was found.`
      }
      return
    }
    
    context.log.info(['api', 'classes', caller, 'length', classes.length])
    context.res = {
      body: classes
    }
  } catch (error) {
    context.log.error(['api', 'classes', caller, 'error', error.message])
    context.res = {
      status: 500,
      body: error.message
    }
  }
}

module.exports = (context, request) => withTokenAuth(context, request, returnClasses)
