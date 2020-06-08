const withTokenAuth = require('../lib/token-auth')
const { getStudents } = require('../lib/api/students')
const { getTeacher } = require('../lib/api/teachers')
const repackStudent = require('../lib/repack-student')

const returnStudents = async function (context, req) {
  const { caller } = req.token
  const name = req.query.name || "*"

  // Verify that we got a caller!
  if(!caller) {
    context.res = {
      status: 403,
      body: `Couldn't read caller from token!`
    }
    return
  }

  try {
    // Get teacher from caller
    const teacher = await getTeacher(context, caller)
    if(!teacher) {
      context.log.warn(['pifu-api', 'students', caller, 'search by name', 'teacher not found'])
      context.res = {
        status: 403,
        body: `Teacher not found: ${caller}`
      }
      return
    }
    
    if(!teacher.groupIds || teacher.groupIds.length === 0) {
      context.log.warn(['pifu-api', 'students', caller, 'search by name', 'teacher has no group'])
      context.res = {
        body: []
      }
      return
    }

    // Get students matching search and teacher classes
    const students = await getStudents(context, {
      groupIds: { $in: teacher.groupIds },
      fullName: { $regex: name.replace('*', '.*'), $options: 'i' }
    })

    context.log(['pifu-api', 'students', caller, 'search by name', 'students', students.length])

    const repackedStudents = students.map((student) => repackStudent(context, student, teacher))
    context.res = {
      body: repackedStudents
    }
  } catch (error) {
    context.log.error(['pifu-api', 'students', caller, 'search by name', 'error', error.message])
    context.res = {
      status: 500,
      body: error.message
    }
  }
}

module.exports = (context, request) => withTokenAuth(context, request, returnStudents)
