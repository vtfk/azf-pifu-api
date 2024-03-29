const { logger } = require('@vtfk/logger')
const withTokenAuth = require('../lib/token-auth')
const { getStudent } = require('../lib/api/students')
const { getTeachers } = require('../lib/api/teachers')
const repackTeacher = require('../lib/repack-teacher')

const returnStudents = async function (context, req) {
  const { id } = context.bindingData

  try {
    // Get students matching the provided username
    const student = await getStudent(context, id)
    if (!student) {
      logger('warn', ['pifu-api', 'student', 'get contactteachers', 'student not found', id])
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

    logger('info', ['pifu-api', 'students', 'get contactteachers', student.username])
    const repackedTeachers = teachers.map((teacher) => repackTeacher(context, teacher))

    const { kontaktlarergruppeIds } = student

    // Mark student contact teachers and get related group ids
    const contactTeachers = repackedTeachers.map(teacher => {
      teacher.contactTeacher = teacher.groupIds.some(id => kontaktlarergruppeIds.includes(id))
      teacher.relatedGroupIds = teacher.groupIds.filter(id => student.groupIds.includes(id))
      return teacher
    })

    context.res = {
      body: contactTeachers
    }
  } catch (error) {
    logger('error', ['pifu-api', 'students', 'get contactteachers', 'error', error.message])
    context.res = {
      status: 500,
      body: error.message
    }
  }
}

module.exports = (context, request) => withTokenAuth(context, request, returnStudents)
