const { getData, getFirst } = require('../get-data')

exports.getClasses = async (context, query) => {
  if (!query) query = { type: { $in: ['basisgruppe', 'undervisningsgruppe'] } }
  const classes = await getData(context, query)
  return classes && classes.length > 0 ? classes : []
}

exports.getClass = async (context, groupId) => {
  const query = { type: { $in: ['basisgruppe', 'undervisningsgruppe'] }, groupId }
  return await getFirst(context, query)
}
