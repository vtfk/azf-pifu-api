const { logger } = require('@vtfk/logger')
const withTokenAuth = require('../lib/token-auth')
const { getTeacher } = require('../lib/api/teachers')
const { getClasses } = require('../lib/api/classes')

const returnTeacherStudents = async function (context, req) {
  const kontaktlarergruppe = (req.query.kontaktlarergruppe && req.query.kontaktlarergruppe.toLowerCase() === 'true') || false
  const { id } = context.bindingData

  try {
    // Get teacher matching the provided username
    const teacher = await getTeacher(context, id)
    if (!teacher) {
      logger('warn', ['pifu-api', 'teacher', 'get contactclasses', 'teacher not found', id])
      context.res = {
        body: []
      }
      return
    }

    if (!teacher.groupIds || teacher.groupIds.length === 0) {
      logger('warn', ['pifu-api', 'teacher', 'get contactclasses', 'teacher has no groups', id])
      context.res = {
        body: []
      }
      return
    }

    // Get basisgrupper the teacher is member of
    const classes = await getClasses(context, {
      memberIds: teacher.id
    })

    logger('info', ['pifu-api', 'teacher', 'get contactclasses', 'classes', classes.length])
    const classIds = classes.filter(group => {
      if (!kontaktlarergruppe) return group.type !== 'kontaktlarergruppe'
      else return group.type === 'kontaktlarergruppe'
    }).map(group => {
      if (!kontaktlarergruppe) return { Id: group.groupId }
      else {
        return {
          Id: group.name,
          SchoolName: group.schoolName
        }
      }
    })
    logger('info', ['pifu-api', 'teacher', 'get contactclasses', 'contactclasses', classIds.length])
    context.res = {
      body: classIds
    }
  } catch (error) {
    logger('error', ['pifu-api', 'teacher', 'get contactclasses', 'error', error.message])
    context.res = {
      status: 500,
      body: error.message
    }
  }
}

module.exports = (context, request) => withTokenAuth(context, request, returnTeacherStudents)
