const getSchools = require('vtfk-schools-info')
const repackStudentGroup = require('./repack-student-group')
const getIsContactTeacher = require('./is-contact-teacher')

module.exports = (context, student, teacher) => {
  const { fullName, mainGroupName, level, groups, schoolIds } = student
  let unitId = mainGroupName && mainGroupName.includes(':') ? mainGroupName.split(':')[0] : schoolIds.length > 0 ? schoolIds[0] : false
  const schools = getSchools(Number.isInteger(Number.parseInt(unitId)) ? { schoolId: unitId } : { shortName: unitId })
  const school = schools.length > 0 ? schools[0] : undefined

  if (!school) {
    context.log.warn(['pifu-api', 'repack-student', 'no school found in vtfk-schools-info for unitId', unitId, student.username])
  } else {
    // unitId må settes til schoolId fordi i 99% av tilfellene så er det mainGroupName som brukes (HJV) og det er schoolId som forventes (38014)
    unitId = school.schoolId
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
