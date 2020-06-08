const withTokenAuth = require('../lib/token-auth')
const { getSchools } = require('../lib/api/schools')

const returnSchools = async function (context, request) {
  const caller = request.token.caller

  try {
    context.log(['pifu-api', 'schools', caller])

    const schools = await getSchools(context)

    context.log(['pifu-api', 'schools', caller, 'length', schools.length])
    context.res = {
      body: schools
    }
  } catch (error) {
    context.log.error(['pifu-api', 'schools', caller, 'error', error.message])
    context.res = {
      status: 500,
      body: error.message
    }
  }
}

module.exports = (context, request) => withTokenAuth(context, request, returnSchools)
