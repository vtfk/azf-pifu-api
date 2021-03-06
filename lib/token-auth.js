const validateToken = require('./validate-token')

module.exports = async (context, request, next) => {
  const bearerToken = request.headers.authorization
  if (!bearerToken) {
    context.log.warn(['token-auth', 'no authorization header present'])
    context.res = {
      status: 400,
      body: 'Missing Authorization header'
    }
    return
  }

  try {
    const token = bearerToken.replace('Bearer ', '')
    const validatedToken = await validateToken(token)
    request.token = validatedToken
  } catch (error) {
    context.log.error(['token-auth', error])
    context.res = {
      status: 401,
      body: 'Invalid authorization token'
    }
    return
  }

  return next(context, request)
}
