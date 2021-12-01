const { logger } = require('@vtfk/logger')
const withTokenAuth = require('../lib/token-auth')
const { getClass } = require('../lib/api/classes')
const { getTeachers } = require('../lib/api/teachers')
const { decode } = require('../lib/decode-uri-id')
const repackTeacher = require('../lib/repack-teacher')

const returnClasses = async function (context, req) {
  const { id: rawId } = context.bindingData
  const id = decode(rawId)

  try {
    const classes = await getClass(context, id)
    if (!classes) {
      context.res = {
        status: 403,
        body: `Class not found: ${id}`
      }
      return
    }

    const teachers = await getTeachers(context, { groupIds: classes.id })
    logger('info', ['pifu-api', 'class', id, 'teachers', 'length', teachers.length])

    const repackedTeachers = teachers.map((teacher) => repackTeacher(context, teacher))
    context.res = {
      body: repackedTeachers
    }
  } catch (error) {
    logger('error', ['pifu-api', 'class', id, 'teachers', 'error', error.message])
    context.res = {
      status: 500,
      body: error.message
    }
  }
}

module.exports = (context, request) => withTokenAuth(context, request, returnClasses)
