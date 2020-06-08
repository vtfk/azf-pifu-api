module.exports = async function (context) {
  context.res = {
    body: { ping: 'pong', timestamp: new Date().getTime() }
  }
}
