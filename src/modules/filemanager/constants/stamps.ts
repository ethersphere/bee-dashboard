const plusOne = 1
const plusThree = 3
const plusSix = 6

export const desiredLifetimeOptions = [
  { value: 0, label: `${plusOne} week` },
  { value: 1, label: `${plusOne} month` },
  { value: 2, label: `${plusThree} months` },
  { value: 3, label: `${plusSix} months` },
  { value: 4, label: `${plusOne} year` },
]

export const lifetimeAdjustments = new Map<number, (date: Date) => void>([
  [0, date => date.setDate(date.getDate() + plusOne * 7)],
  [1, date => date.setMonth(date.getMonth() + plusOne)],
  [2, date => date.setMonth(date.getMonth() + plusThree)],
  [3, date => date.setMonth(date.getMonth() + plusSix)],
  [4, date => date.setFullYear(date.getFullYear() + plusOne)],
])
