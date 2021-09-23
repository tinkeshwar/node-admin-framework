export const monthCheck = (months: number[]) => {
  let check = true

  if (months.length > 12) {
    return false
  }

  for (let i = 0; i < months.length; i++) {
    if (months[i] >= 4 && months[i] < 12 && months[i + 1] !== undefined) {
      if (getInt(months[i]) + 1 !== getInt(months[i + 1])) {
        check = false
        break
      }
    } else if (getInt(months[i]) === 12 && months[i + 1] !== undefined) {
      if (getInt(months[i + 1]) !== 1) {
        check = false
        break
      }
    } else if (months[i] >= 1 && months[i] < 4 && months[i + 1] !== undefined) {
      if (getInt(months[i]) + 1 !== getInt(months[i + 1])) {
        check = false
        break
      }
    }
  }
  return check
}

export const getInt = (num:number|string|undefined) => {
  if (typeof num === 'string') {
    return parseInt(num, 10)
  } else if (typeof num === 'undefined') {
    return 0
  } else {
    return num
  }
}

export const getFloat = (num:number|string|undefined) => {
  if (typeof num === 'string') {
    return parseFloat(num)
  } else if (typeof num === 'undefined') {
    return 0
  } else {
    return num
  }
}
