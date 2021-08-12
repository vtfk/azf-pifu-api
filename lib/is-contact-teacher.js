module.exports = (student, teacher) => {
  if (!teacher.kontaktlarergruppeIds || teacher.kontaktlarergruppeIds.length === 0) return false
  if (!student.groupIds || student.groupIds.length === 0) return false

  // Is the teacher and student member of the same Kontaktlærergruppe?
  const matches = student.groupIds.find(id => teacher.kontaktlarergruppeIds.includes(id))

  return matches && matches.length > 0
}
