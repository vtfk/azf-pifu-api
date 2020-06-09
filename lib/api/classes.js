const { getData, getFirst } = require('../get-data')

exports.getClasses = async (context, query = {}) => {
  query.type = 'basisgruppe'
  const classes = await getData(context, query)
  return classes && classes.length > 0 ? classes : []
}

exports.getClass = async (context, groupId) => {
  const query = { type: 'basisgruppe', groupId }
  return await getFirst(context, query)
}
