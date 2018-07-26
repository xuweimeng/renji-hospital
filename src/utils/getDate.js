// 获取当前时间，年，月，日
const current = new Date()
let currentYear = current.getFullYear()
let currentMonth = current.getMonth() + 1
let currentDate = current.getDate()
currentMonth>9?currentMonth:currentMonth='0'+currentMonth
currentDate>9?currentDate:currentDate='0'+currentDate

let currentTime = currentYear + '-' + currentMonth + '-' + currentDate
let currentTime1 = currentYear + '-' + currentMonth + '-'

export {currentYear, currentMonth, currentDate, currentTime, currentTime1};
