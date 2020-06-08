const jwt = require('jsonwebtoken')

module.exports = async token => {
  const verifiedToken = process.env.JWT_SECRET ? jwt.verify(token, process.env.JWT_SECRET) : true
  return verifiedToken
}
