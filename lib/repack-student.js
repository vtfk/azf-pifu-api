const getSchools = require('vtfk-schools-info')
const repackStudentGroup = require('./repack-student-group')
const getIsContactTeacher = require('./is-contact-teacher')

module.exports = (context, student, teacher) => {
  const { fullName, mainGroupName, groups, schoolIds } = student
  const unitId = schoolIds.length > 0 ? schoolIds[0].split('@')[0] : mainGroupName.split(':')[0]
  const schools = getSchools({ shortName: unitId })
  const school = schools[0]

  if (!school) {
    context.log.warn(['pifu-api', 'repack-student', 'no school found in vtfk-schools-info for unitId', unitId, student.username])
  }

  return {
    firstName: student.givenName,
    middleName: null,
    lastName: student.familyName,
    fullName,
    personalIdNumber: student.ssn,
    mobilePhone: student.phone,
    mail: student.email,
    userName: student.username,
    contactTeacher: teacher ? !!getIsContactTeacher(student, teacher) : false,
    unitId,
    unitName: school.officialName,
    organizationNumber: school.organizationNumber,
    mainGroupName: mainGroupName || '',
    groups: groups.map(repackStudentGroup)
  }
}
