const getData = require('../get-data')

exports.getClasses = async (context) => {
  const query = { type: 'basisgruppe' }
  return await getData(context, query)
}

exports.getClass = async (context, groupId) => {
  const query = { type: 'basisgruppe', groupId }
  return await getData(context, query)
}