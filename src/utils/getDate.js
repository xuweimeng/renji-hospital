// 获取当前时间，年，月，日
const current = new Date();
const currentYear = current.getFullYear();
let currentMonth = current.getMonth() + 1;
let currentDate = current.getDate();
currentMonth > 9 ? currentMonth : currentMonth = '0' + currentMonth;
currentDate > 9 ? currentDate : currentDate = '0' + currentDate;

const currentTime = currentYear + '-' + currentMonth + '-' + currentDate;
const currentTime1 = currentYear + '-' + currentMonth + '-';

export { currentYear, currentMonth, currentDate, currentTime, currentTime1 };
