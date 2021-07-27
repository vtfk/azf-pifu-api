const getSchools = require('vtfk-schools-info')

function generateId (group) {
  const idArray = []
  const splittedName = group.name.split('_')
  const school = splittedName.pop()
  idArray.push(school.split('@')[0])
  idArray.push(splittedName[0])
  return idArray.join(':')
}

module.exports = group => {
  const id = generateId(group)
  const { description, schoolId } = group
  const schools = getSchools({ schoolId })
  const school = schools[0]
  const unitId = school.shortName
  return {
    id,
    description,
    unitId,
    unitName: school.officialName,
    organizationNumber: school.organizationNumber
  }
}
