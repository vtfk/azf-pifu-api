const { logger } = require('@vtfk/logger')
const withTokenAuth = require('../lib/token-auth')
const { getTeacher } = require('../lib/api/teachers')
const { getSchools } = require('../lib/api/schools')

const returnSchools = async function (context, req) {
  const { caller } = req.token

  // Verify that we got a caller!
  if (!caller) {
    context.res = {
      status: 401,
      body: 'Couldn\'t read caller from token!'
    }
    return
  }

  try {
    // Get teacher from caller
    const teacher = await getTeacher(context, caller)
    if (!teacher) {
      logger('warn', ['pifu-api', 'my-schools', 'teacher not found'])
      context.res = {
        status: 403,
        body: `Teacher not found: ${caller}`
      }
      return
    }

    if (!teacher.schoolIds || teacher.schoolIds.length === 0) {
      logger('warn', ['pifu-api', 'my-schools', 'teacher has no school relation'])
      context.res = {
        body: []
      }
      return
    }

    // Get schools matching teacher schools
    const schools = await getSchools(context, {
      id: { $in: teacher.schoolIds }
    })

    logger('info', ['pifu-api', 'my-schools', 'schools', schools.length])

    context.res = {
      body: schools
    }
  } catch (error) {
    logger('error', ['pifu-api', 'my-schools', 'error', error.message])
    context.res = {
      status: 500,
      body: error.message
    }
  }
}

module.exports = (context, request) => withTokenAuth(context, request, returnSchools)
