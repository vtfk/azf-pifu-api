const getSchools = require('vtfk-schools-info')
const repackStudentGroup = require('./repack-student-group')
const getIsContactTeacher = require('./is-contact-teacher')

module.exports = (context, student, teacher) => {
  const { fullName, mainGroupName, level, groups, schoolIds } = student
  const unitId = schoolIds.length > 0 ? schoolIds[0] : mainGroupName.split(':')[0]
  const schoolsById = getSchools({ schoolId: unitId })
  const schoolsByShortName = getSchools({ shortName: unitId })
  const school = schoolsById.length > 0 ? schoolsById[0] : schoolsByShortName[0]

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
    level: level || 'VG1',
    utdanningsprogram: student.utdanningsprogrammer,
    groups: groups.map(repackStudentGroup)
  }
}
