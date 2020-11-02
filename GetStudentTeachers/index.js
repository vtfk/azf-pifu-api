const withTokenAuth = require('../lib/token-auth')
const { getStudent } = require('../lib/api/students')
const { getTeachers } = require('../lib/api/teachers')
const repackTeacher = require('../lib/repack-teacher')

const returnStudents = async function (context, req) {
  const { caller } = req.token
  const { id } = context.bindingData

  try {
    // Get students matching the provided username
    const student = await getStudent(context, id)
    if (!student) {
      context.log.warn(['pifu-api', 'student', caller, 'get contactteachers', 'student not found', id])
      context.res = {
        status: 403,
        body: `Student not found: ${id}`
      }
      return
    }

    // Get all student teachers
    const teachers = await getTeachers(context, {
      groupIds: { $in: [...student.groupIds] }
    })

    context.log(['pifu-api', 'students', caller, 'get contactteachers', student.username])
    const repackedTeachers = teachers.map((teacher) => repackTeacher(context, teacher))

    // Mark student contact teachers
    const { kontaktlarergruppeIds, ordenIds, atferdIds } = student
    const kontaktIds = [...kontaktlarergruppeIds, ...ordenIds, ...atferdIds]

    const contactTeachers = repackedTeachers.map(teacher => {
      teacher.contactTeacher = teacher.groupIds.some(id => kontaktIds.includes(id))
      return teacher
    })

    context.res = {
      body: contactTeachers
    }
  } catch (error) {
    context.log.error(['pifu-api', 'students', caller, 'get contactteachers', 'error', error.message])
    context.res = {
      status: 500,
      body: error.message
    }
  }
}

module.exports = (context, request) => withTokenAuth(context, request, returnStudents)
