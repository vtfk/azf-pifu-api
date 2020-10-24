const withTokenAuth = require('../lib/token-auth')
const repackClasses = require('../lib/repack-class-members')
const { getTeacher } = require('../lib/api/teachers')
const { getClasses } = require('../lib/api/classes')

const returnClasses = async function (context, req) {
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
      context.log.warn(['pifu-api', 'my-classes', caller, 'teacher not found'])
      context.res = {
        status: 403,
        body: `Teacher not found: ${caller}`
      }
      return
    }

    if (!teacher.groupIds || teacher.groupIds.length === 0) {
      context.log.warn(['pifu-api', 'my-classes', caller, 'teacher has no group'])
      context.res = {
        body: []
      }
      return
    }

    // Get classes matching teacher groupIds
    const classes = await getClasses(context, {
      id: { $in: teacher.groupIds }
    })

    context.log(['pifu-api', 'my-classes', caller, 'classes', classes.length])

    const repackedClasses = classes.map(repackClasses)
    context.res = {
      body: repackedClasses
    }
  } catch (error) {
    context.log.error(['pifu-api', 'my-classes', caller, 'error', error.message])
    context.res = {
      status: 500,
      body: error.message
    }
  }
}

module.exports = (context, request) => withTokenAuth(context, request, returnClasses)
