const withTokenAuth = require('../lib/token-auth')
const { getStudent } = require('../lib/api/students')
const { getTeacher } = require('../lib/api/teachers')
const repackStudent = require('../lib/repack-student')

const returnStudents = async function (context, req) {
  const { caller } = req.token
  const { id } = context.bindingData

  try {
    // Get students matching the provided username
    const student = await getStudent(context, id)
    if (!student) {
      context.log.warn(['pifu-api', 'student', caller, 'get student', id, 'student not found', id])
      context.res = {
        status: 404,
        body: `Student not found: ${id}`
      }
      return
    }

    let teacher
    if(caller) {
      teacher = await getTeacher(context, caller)
      if (!teacher) {
        context.log.warn(['pifu-api', 'student', caller, 'get student', id, 'teacher not found'])
        context.res = {
          status: 403,
          body: `Teacher not found: ${caller}`
        }
        return
      }
    }

    context.log(['pifu-api', 'student', caller, 'get student', student.username])
    const repackedStudent = repackStudent(context, student, teacher)
    context.res = {
      body: [repackedStudent]
    }
  } catch (error) {
    context.log.error(['pifu-api', 'student', caller, 'get student', 'error', error.message])
    context.res = {
      status: 500,
      body: error.message
    }
  }
}

module.exports = (context, request) => withTokenAuth(context, request, returnStudents)
