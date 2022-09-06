const { logger, logConfig } = require('@vtfk/logger')
const validateToken = require('./validate-token')

module.exports = async (context, request, next) => {
  logConfig({
    azure: {
      context,
      excludeInvocationId: true
    }
  })
  const bearerToken = request.headers.authorization
  if (!bearerToken) {
    logger('warn', ['token-auth', 'no authorization header present'])
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
    validatedToken.type = validatedToken.type || 'teacher'
    logConfig({
      prefix: `${validatedToken.type} - ${validatedToken.caller}`
    })
  } catch (error) {
    logger('error', ['token-auth', error])
    context.res = {
      status: 401,
      body: 'Invalid authorization token'
    }
    return
  }

  return next(context, request)
}
