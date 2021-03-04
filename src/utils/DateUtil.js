/**
 * 日期时间格式化
 * @param {Object} date 时间对象
 * @param {String} fmt 需要格式化的时间格式，如：'yyyy-MM-dd'
 * @returns {String}
 */
export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = o[k] + ''
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : padLeftZero(str)
      )
    }
  }
  return fmt
}

export function formatDateForMillisecond(time, fmt) {
  const date = new Date()
  date.setTime(time)
  return formatDate(date, fmt)
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}
