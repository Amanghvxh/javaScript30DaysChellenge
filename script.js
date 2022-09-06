'use strict';

const drums = document.querySelectorAll('.drumbeats')
const body = document.querySelector('body')
const audio = document.querySelector('.audio')
const keysObj = {
    'a'  : './sounds/boom.wav',
    'b'  : './sounds/clap.wav',
    'c'  : './sounds/hihat.wav',
    'd'  : './sounds/kick.wav',
    'e'  : './sounds/openhat.wav'
}

const generateRandomNum = function(){
     return  Math.floor(Math.random()*250+1)
}

const randomBackgroundChanger = function(element){ 
    element.style.backgroundColor = `rgb(${generateRandomNum()},${generateRandomNum()},${generateRandomNum()})` 
}

const removeClass = function(element){
    element.forEach(el=>el.classList.remove('hidden'))
}
document.addEventListener('keypress',(e)=>{
    randomBackgroundChanger(body)
        audio.src = keysObj[e.key]

        drums.forEach(drum=>{
            removeClass(drums)
            if(drum.dataset.play === e.key){
                drum.classList.add('hidden')
                setTimeout(()=>drum.classList.remove('hidden'),1000)
            }
        })
        audio.play()
})

drums.forEach(drum=>{
    drum.addEventListener('click',(e)=>{
        audio.src = keysObj[e.target.dataset.play]
        removeClass(drums)
        e.target.classList.add('hidden')
        setTimeout(() => {
          drum.classList.remove('hidden')
        }, 1000);
        randomBackgroundChanger(body)
        audio.play()
    })
})
