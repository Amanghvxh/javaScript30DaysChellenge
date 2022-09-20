const secondsHand = document.querySelector('.seconds_hand')
const minutesHand = document.querySelector('.minutes_hand')
const hoursHand   = document.querySelector('.hours_hand')
const AmPm = document.querySelector('.span_amPm')
const location2 = navigator.geolocation
const body = document.querySelector('body')
const hands = document.querySelectorAll('.hand')
const img = document.querySelectorAll('img')
const triangle = document.querySelectorAll('.triangle')
const darkToggle = document.querySelector('.dark_mode_toggle')
const darkToggleButton = document.querySelector('.toggle_button')
const darkContainer = document.querySelector('.alarm_container')
const darkSubmitButton = document.querySelector('.submit')
const darkInputs = document.querySelectorAll('.alarm_inputs')
const alarmText = document.querySelector('.alarm_text')
let hours,seconds,minutes,aMinute,aHour,aSecond,timeSec,intervalId
const snoozeButton = document.querySelector('.snooze')
const audio = document.querySelector('.audio')
const stopButton = document.querySelector('.stop_alarm')
const alarmContainer = document.querySelector('.alarm_time')
//const getPosition = function(position){
    //const lat = position.coords.latitude
  //  const long = position.coords.longitude
   // return [lat,long]

//}

const darkMode = function(){
    img.forEach(img=>img.classList.toggle('dark'))
    body.classList.toggle('darkBody')
    hands.forEach(hand=>hand.classList.toggle('darkHand'))
    triangle.forEach(triangle=>triangle.classList.toggle('darkTriangle'))
    AmPm.classList.toggle('darkAmPm')
    darkToggle.classList.toggle('darkToggle')
    darkToggleButton.classList.toggle('darkToggleButton')
    darkContainer.classList.toggle('darkContainer')
    darkSubmitButton.classList.toggle('darkSubmit')
    darkInputs.forEach(inputs=>inputs.classList.toggle('darkInputs'))
    stopButton.classList.toggle('darkSnoozBtn')
    snoozeButton.classList.toggle('darkSnoozBtn')
    alarmContainer.classList.toggle('darkContainerText')
}
const getTime = function(){
    const time = new Date()
    const hours = time.getHours()
    const minutes = time.getMinutes()
    const seconds = time.getSeconds()
    return [hours,minutes,seconds]
}
const clock = function(){
    const [hours,minutes,seconds] = getTime()
   

    //Seconds
    const degSeconds = 6 * seconds
    secondsHand.style.transform = `rotate(${degSeconds+90}deg)`

    //Minutes
    const degMinutes = 6 * minutes
    minutesHand.style.transform = `rotate(${degMinutes+90}deg)`

    //Hours
    const degHours =  ((hours/12)*360)+((minutes/60)*30)+90
    hoursHand.style.transform = `rotate(${degHours}deg)`

    //Am - Pm 
    AmPm.innerText = hours>=12 ? 'PM' : 'AM'
    

}

const inputData = function(e){
   e?e.preventDefault():''
    const inputs = document.querySelectorAll('.alarm_inputs')
    let [hourst,minutest,secondst] = [...inputs].map(input=> +input.value)
    hours = hourst
    seconds = secondst
    minutes = minutest
    inputs.forEach(input=>input.innerText='')
    return [hours,minutes,seconds]
}
const calculateAlarmTime = function(e){
    const [aHours,aMinutes,aSeconds] = getTime()
    if(hours>24||hours<0||minutes>60||minutes<0||seconds>60||seconds<0) return
    let [resHour,resMinutes,resSeconds] = [hours+aHours,minutes+aMinutes,seconds+aSeconds]
    if(resHour>24)resHour-=24
    if(resMinutes>60){
        resHour++
        resMinutes-=60
    }
    if(resSeconds>60){
        resMinutes++
        resSeconds-=60
}aHour = resHour
aMinute = resMinutes
aSecond = resSeconds
totalSec = (aHour*3600)+(aMinute*60)+(aSecond)
return [resHour,resMinutes,resSeconds]
    }
const hhMmSs = function(seconds){
    return new Date(seconds*1000).toISOString().slice(11,19)
}
const timesInSec = function(){
    const [hours,minutes,seconds] = getTime()
 console.log(hours,minutes,seconds)
//   /let totalSec = (aHour*3600)+(aMinute*60)+(aSecond)
  let timeSec = (hours*3600)+(minutes*60)+(seconds)
  return timeSec
}
const snoozeAndStopVisible = function(){
    snoozeButton.style.display='inline-block'
    alarmText.style.display = 'none'
    stopButton.style.display ='inline-block'
    audio.play()
}
const ifElseAlarm =function(timeSec,totalSec){
    if(+totalSec === +timeSec){
        clearInterval(intervalId)
        snoozeAndStopVisible()
     }else{
     const time = hhMmSs(totalSec-timeSec)
     alarmText.innerText = time
    }
}
const alarm = function(e){
 let timeSec = timesInSec()
 ifElseAlarm(timeSec,totalSec)
}
const snoozeAlarm = function(){
    let timeSec = timesInSec()
 ifElseAlarm(timeSec,totalSec)
}

const snooze = function(){
    let timeSec = timesInSec()
 totalSec = timeSec+(5*60)
stop()
alarmText.innerText = ''
snoozeButton.style.display = 'none'
stopButton.style.display = 'none'
alarmText.style.display = 'inline-block'
snoozeAlarm()
}
const stop = function(){
    audio.pause()
    audio.currentTime = 0
}
const stopAlarm = function(e){
    e.preventDefault()
    minutes = seconds = hours = aMinute = aHour = aSecond = 0
    stop()
    clearInterval(intervalId)
    alarmText.innerText = ''
    snoozeButton.style.display = 'none'
    stopButton.style.display = 'none'
    alarmText.style.display = 'none'
    alarmContainer.style.display = 'none'

}
setInterval(clock,1000)
clock()
const alarmDisplaySettings = function(){
    snoozeButton.style.display = 'none'
    stopButton.style.display = 'none'
    alarmText.innerText = ''
    alarmText.style.display = 'inline-block'
    alarmContainer.style.display = 'inline-block'
}
darkSubmitButton.addEventListener('click',(e)=>{
   alarmDisplaySettings()
    clearInterval(intervalId)
    inputData(e)
    calculateAlarmTime(e)
    alarm()
   intervalId =  setInterval(alarm,1000)
})

stopButton.addEventListener('click',stopAlarm)
snoozeButton.addEventListener('click',()=>{
    snooze()
   intervalId = setInterval(snoozeAlarm,1000)
})

darkToggle.addEventListener('click',darkMode)