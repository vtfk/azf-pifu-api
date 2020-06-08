const mongo = require('../lib/mongo')

const getData = async (context, query) => {
  const db = await mongo(context)
  const tjommi = db.collection(process.env.MONGODB_COLLECTION)
  return tjommi.find(query).toArray()
}

const getFirst = async (context, query) => {
  const db = await mongo(context)
  const tjommi = db.collection(process.env.MONGODB_COLLECTION)
  return tjommi.findOne(query)
}

module.exports = getData
module.exports.getData = getData
module.exports.getFirst = getFirst