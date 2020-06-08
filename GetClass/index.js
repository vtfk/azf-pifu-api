const withTokenAuth = require('../lib/token-auth')
const { getClass } = require('../lib/api/classes')

const returnClass = async function (context, req) {
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
