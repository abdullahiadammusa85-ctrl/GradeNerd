export const GRADE_POINTS = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 }
export const GRADE_LABELS = ['A', 'B', 'C', 'D', 'E', 'F']

export function getDegreeClass(cgpa) {
  if (cgpa >= 4.5) return { label: 'First Class',        color: '#22c55e', bg: 'rgba(34,197,94,0.12)',   rank: 4 }
  if (cgpa >= 3.5) return { label: 'Second Class Upper', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  rank: 3 }
  if (cgpa >= 2.4) return { label: 'Second Class Lower', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  rank: 2 }
  if (cgpa >= 1.5) return { label: 'Third Class',        color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   rank: 1 }
  return              { label: 'Below Pass',             color: '#6b7280', bg: 'rgba(107,114,128,0.12)', rank: 0 }
}

export function calcSemesterGPA(courses) {
  const totalUnits  = courses.reduce((s, c) => s + (parseFloat(c.units) || 0), 0)
  const totalPoints = courses.reduce((s, c) => s + (parseFloat(c.units) || 0) * (GRADE_POINTS[c.grade] ?? 0), 0)
  return totalUnits > 0 ? totalPoints / totalUnits : 0
}

export function calcCGPA(semesters) {
  const totalUnits  = semesters.reduce((s, sem) => s + sem.courses.reduce((a, c) => a + (parseFloat(c.units) || 0), 0), 0)
  const totalPoints = semesters.reduce((s, sem) => s + sem.courses.reduce((a, c) => a + (parseFloat(c.units) || 0) * (GRADE_POINTS[c.grade] ?? 0), 0), 0)
  return totalUnits > 0 ? totalPoints / totalUnits : 0
}

export const emptyCourse   = () => ({ id: Date.now() + Math.random(), title: '', code: '', units: '', grade: 'A' })
export const emptySemester = (index) => ({
  id: Date.now() + Math.random(),
  name: `Semester ${index + 1}`,
  session: '',
  courses: [emptyCourse()],
})