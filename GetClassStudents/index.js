const withTokenAuth = require('../lib/token-auth')
const { getClass } = require('../lib/api/classes')
const { getStudents } = require('../lib/api/students')

const returnClasses = async function (context, req) {
  const caller = req.token.caller
  const { id } = context.bindingData

  try {
    const classes = await getClass(context, id)
    const students = await getStudents(context, {
      groupIds: classes[0].id
    })

    context.log.info(['api', 'class', id, 'students', caller, 'length', students.length])
    context.res = {
      body: students
    }
  } catch (error) {
    context.log.error(['api', 'class', id, 'students', caller, 'error', error.message])
    context.res = {
      status: 500,
      body: error.message
    }
  }
}

module.exports = (context, request) => withTokenAuth(context, request, returnClasses)
