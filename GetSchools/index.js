const withTokenAuth = require('../lib/token-auth')
const { getSchools } = require('../lib/api/schools')

const returnSchools = async function (context, request) {
  const caller = request.token.caller

  try {
    const schools = await getSchools(context)
    if (!schools || schools.length <= 0) {
      context.res = {
        status: 404,
        body: 'No schools found.'
      }
      return
    }

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
