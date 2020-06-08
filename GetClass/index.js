const withTokenAuth = require('../lib/token-auth')
const { getClass } = require('../lib/api/classes')

const returnClass = async function (context, req) {
  const caller = req.token.caller
  const { id } = context.bindingData

  try {
    const classes = await getClass(context, id)

    context.log.info(['api', 'class', id, caller, 'length', classes.length])
    context.res = {
      body: classes
    }
  } catch (error) {
    context.log.error(['api', 'class', id, caller, 'error', error.message])
    context.res = {
      status: 500,
      body: error.message
    }
  }
}

module.exports = (context, request) => withTokenAuth(context, request, returnClass)
