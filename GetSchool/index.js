const withTokenAuth = require('../lib/token-auth')
const { getSchool } = require('../lib/api/schools')

const returnSchool = async function (context, req) {
  const caller = req.token.caller
  const { id } = context.bindingData

  try {
    const schools = await getSchool(context, id)

    context.log.info(['pifu-api', 'school', id, caller, 'length', schools.length])
    context.res = {
      body: schools
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
