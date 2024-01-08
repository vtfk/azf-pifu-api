const getSchools = require('vtfk-schools-info')

const generateId = (shortName, group) => {
  const splittedName = group.name.split('/')
  return `${shortName}:${splittedName[splittedName.length > 1 ? 1 : 0]}`
}

module.exports = group => {
  const { description, schoolId } = group
  let schools = getSchools({ schoolId })
  if (schools.length === 0) {
    schools = getSchools({ schoolNumber: schoolId })
  }
  const school = schools[0]
  const unitId = school.shortName
  const id = generateId(unitId, group)
  return {
    id,
    description,
    unitId,
    unitName: school.officialName,
    organizationNumber: school.organizationNumber
  }
}
