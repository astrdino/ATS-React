

const currDate = new Date()
console.log(currDate.getDate(), "DD")
console.log(currDate.getMonth()+1, "MM")
console.log(currDate.getFullYear())

//Formating Date
var todayDate,todayMonth

if(currDate.getDate() > 0 && currDate.getDate() < 10){
    todayDate = `0${currDate.getDate()}`
}

if(currDate.getMonth()+1 > 0 && currDate.getMonth()+1 < 10){
    todayMonth = `0${currDate.getMonth()+1}`
}

var todayString = `${currDate.getFullYear()}-${todayMonth}-${todayDate}`

console.log(todayString);


