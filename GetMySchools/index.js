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
      context.log.warn(['pifu-api', 'my-schools', caller, 'teacher not found'])
      context.res = {
        status: 403,
        body: `Teacher not found: ${caller}`
      }
      return
    }

    if (!teacher.schoolIds || teacher.schoolIds.length === 0) {
      context.log.warn(['pifu-api', 'my-schools', caller, 'teacher has no school relation'])
      context.res = {
        body: []
      }
      return
    }

    // Get schools matching teacher schools
    const schools = await getSchools(context, {
      id: { $in: teacher.schoolIds }
    })

    context.log(['pifu-api', 'my-schools', caller, 'schools', schools.length])

    context.res = {
      body: schools
    }
  } catch (error) {
    context.log.error(['pifu-api', 'my-schools', caller, 'error', error.message])
    context.res = {
      status: 500,
      body: error.message
    }
  }
}

module.exports = (context, request) => withTokenAuth(context, request, returnSchools)
