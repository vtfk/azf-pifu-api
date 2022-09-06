module.exports = (context, student) => {
  if (student._id) delete student._id
  if (student.sasUsername) delete student.sasUsername
  if (student.personalEmail) delete student.personalEmail
  if (student.address) delete student.address

  return student
}
