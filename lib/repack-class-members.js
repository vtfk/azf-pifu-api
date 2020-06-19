module.exports = (classObj) => {
  if (classObj.memberIds) {
    delete classObj.memberIds
  }

  return classObj
}
