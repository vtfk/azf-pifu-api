module.exports = (student, teacher) => {
  if (!teacher.atferdIds || teacher.atferdIds.length === 0) return false
  if (!student.groupIds || student.groupIds.length === 0) return false

  // Is the teacher and student member of the same ATF-group?
  const matches = student.groupIds.find(id => teacher.atferdIds.includes(id))

  return matches && matches.length > 0
}
