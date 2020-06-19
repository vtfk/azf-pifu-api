const withTokenAuth = require('../lib/token-auth')
const { getSchool } = require('../lib/api/schools')

const returnSchool = async function (context, req) {
  const caller = req.token.caller
  const { id } = context.bindingData

  try {
    const school = await getSchool(context, id)
    if (!school) {
      context.res = {
        status: 403,
        body: `School not found: ${id}`
      }
      return
    }

    context.log.info(['pifu-api', 'school', id, caller, 'length', school.id])
    context.res = {
      body: [school]
    }
  } catch (error) {
    context.log.error(['pifu-api', 'school', id, caller, 'error', error.message])
    context.res = {
      status: 500,
      body: error.message
    }
  }
}

module.exports = (context, request) => withTokenAuth(context, request, returnSchool)
