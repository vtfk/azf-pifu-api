const getSchools = require('vtfk-schools-info')

const generateId = (shortName, group) => {
  const splittedName = group.name.split('/')
  return `${shortName}:${splittedName[splittedName.length > 1 ? 1 : 0]}`
}

module.exports = group => {
  const { description, schoolId } = group
  const schools = getSchools({ schoolId })
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
