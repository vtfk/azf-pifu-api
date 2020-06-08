const withTokenAuth = require('../lib/token-auth')
const { getSchool } = require('../lib/api/schools')

const returnSchool = async function (context, req) {
  const caller = req.token.caller
  const { schoolId } = context.bindingData

  try {
    const schools = await getSchool(context, schoolId)

    context.log.info(['api', 'school', schoolId, caller, 'length', schools.length])
    context.res = {
      body: schools
    }
  } catch (error) {
    context.log.error(['api', 'school', schoolId, caller, 'error', error.message])
    context.res = {
      status: 500,
      body: error.message
    }
  }
}

module.exports = (context, request) => withTokenAuth(context, request, returnSchool)
