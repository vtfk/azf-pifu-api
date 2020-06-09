const withTokenAuth = require('../lib/token-auth')
const { getTeachers } = require('../lib/api/teachers')
const repackTeacher = require('../lib/repack-teacher')

const returnTeachers = async function (context, req) {
  const { caller } = req.token
  const name = req.query.name || '*'

  try {
    // Get teacher matching search
    const teachers = await getTeachers(context, {
      fullName: { $regex: name.replace('*', '.*'), $options: 'i' }
    })

    context.log(['pifu-api', 'teachers', caller, 'search by name', 'teachers', teachers.length])

    const repackedTeachers = teachers.map((teacher) => repackTeacher(context, teacher))
    context.res = {
      body: repackedTeachers
    }
  } catch (error) {
    context.log.error(['pifu-api', 'teachers', caller, 'search by name', 'error', error.message])
    context.res = {
      status: 500,
      body: error.message
    }
  }
}

module.exports = (context, request) => withTokenAuth(context, request, returnTeachers)
