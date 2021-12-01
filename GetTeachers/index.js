const { logger } = require('@vtfk/logger')
const withTokenAuth = require('../lib/token-auth')
const { getTeachers } = require('../lib/api/teachers')
const repackTeacher = require('../lib/repack-teacher')

const returnTeachers = async function (context, req) {
  const name = req.query.name || '*'

  try {
    // Get teacher matching search
    const teachers = await getTeachers(context, {
      fullName: { $regex: name.replace('*', '.*'), $options: 'i' }
    })

    logger('info', ['pifu-api', 'teachers', 'search by name', 'teachers', teachers.length])

    const repackedTeachers = teachers.map((teacher) => repackTeacher(context, teacher))
    context.res = {
      body: repackedTeachers
    }
  } catch (error) {
    logger('error', ['pifu-api', 'teachers', 'search by name', 'error', error.message])
    context.res = {
      status: 500,
      body: error.message
    }
  }
}

module.exports = (context, request) => withTokenAuth(context, request, returnTeachers)
