const withTokenAuth = require('../lib/token-auth')
const { getTeacher } = require('../lib/api/teachers')
const repackTeacher = require('../lib/repack-teacher')

const returnUser = async function (context, req) {
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
      context.log.warn(['pifu-api', 'me', caller, 'get user', 'teacher not found'])
      context.res = {
        status: 401,
        body: `Teacher not found: ${caller}`
      }
      return
    }

    const repackedTeacher = repackTeacher(context, teacher)
    context.res = {
      body: repackedTeacher
    }
  } catch (error) {
    context.log.error(['pifu-api', 'me', caller, 'get user', 'error', error.message])
    context.res = {
      status: 500,
      body: error.message
    }
  }
}

module.exports = (context, request) => withTokenAuth(context, request, returnUser)
