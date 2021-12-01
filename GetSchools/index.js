const { logger } = require('@vtfk/logger')
const withTokenAuth = require('../lib/token-auth')
const { getSchools } = require('../lib/api/schools')

const returnSchools = async function (context, request) {
  try {
    const schools = await getSchools(context)
    if (!schools || schools.length <= 0) {
      context.res = {
        status: 403,
        body: 'No schools found.'
      }
      return
    }

    logger('info', ['pifu-api', 'schools', 'length', schools.length])
    context.res = {
      body: schools
    }
  } catch (error) {
    logger('error', ['pifu-api', 'schools', 'error', error.message])
    context.res = {
      status: 500,
      body: error.message
    }
  }
}

module.exports = (context, request) => withTokenAuth(context, request, returnSchools)
