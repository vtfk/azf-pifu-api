module.exports = (context, teacher) => {
  if(teacher._id) delete teacher._id
  if(teacher.sasUsername) delete teacher.sasUsername
  if(teacher.personalEmail) delete teacher.personalEmail
  if(teacher.address) delete teacher.address

  return teacher
}
