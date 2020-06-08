const mongo = require('../lib/mongo')

module.exports = async (context, query) => {
  const db = await mongo(context)
  const tjommi = db.collection(process.env.MONGODB_COLLECTION)
  return tjommi.find(query).toArray()
}
