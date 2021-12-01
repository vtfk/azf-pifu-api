const { logger } = require('@vtfk/logger')
const withTokenAuth = require('../lib/token-auth')
const { getSchool } = require('../lib/api/schools')

const returnSchool = async function (context, req) {
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

    logger('info', ['pifu-api', 'school', id, 'length', school.id])
    context.res = {
      body: [school]
    }
  } catch (error) {
    logger('error', ['pifu-api', 'school', id, 'error', error.message])
    context.res = {
      status: 500,
      body: error.message
    }
  }
}

module.exports = (context, request) => withTokenAuth(context, request, returnSchool)
