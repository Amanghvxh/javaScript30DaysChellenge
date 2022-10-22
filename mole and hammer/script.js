'use strict'
const holeContainer = document.querySelector('.hole_container')
const holes = document.querySelectorAll('.hole')
const restartButton = document.querySelector('.restart_button') 
const gameOverContainer = document.querySelector('.game_over_container')
const moleImages = document.querySelectorAll('img')
const hammerImage = document.querySelector('.hammer_image')
let randomNum, score = 9
const totalScore = document.querySelector('.total_score_p')
let timeoutShowMole,timeoutGetHoleClick
const showMole = function () {
    randomNum = generateRandomNum()
    holes.forEach(hole => {
        const imageContainer = hole.querySelector('.hole_main')
        const num = +imageContainer.dataset.holenumber
        console.log('outside')
        if (randomNum !== num) return
        console.log('inside')
        const mole = hole.querySelector('img')
        pushImagesBack()
        mole.style.bottom = '63px'
        setTimeout(() => mole.style.bottom = '0px', 300);
    })
}
const getHoleClick = function (e) {
    if (!e.target.closest('.hole')) return
    const num = +e.target.dataset.holenumber
    scoreFunction(num)
    totalScore.innerText = score
    if (num !== randomNum) return
    pushImagesBack()
    const mole = e.target.querySelector('img')
    mole.style.bottom = '63px'
    timeoutGetHoleClick = setTimeout(() => mole.style.bottom = '0px',3000);
}
const generateRandomNum = function () {
    return Math.floor(Math.random() * 3) + 1
}

const scoreFunction = function (num) {
    num !== randomNum ? score-- : score++
    if (score <= 0) score = 0
    if (score >= 10) { 
        score = 0 
        gameOver()
    }
}

const gameOver = function(){
    gameOverContainer.style.display = 'flex'
    clearTimeout(timeoutGetHoleClick)
    clearInterval(timeoutShowMole)
}

const restartGame = function(){
    showMole()
    timeoutShowMole = setInterval(showMole, 700)
    gameOverContainer.style.display = 'none'
    moleImages.forEach(img=>{img.style.bottom = '0px'})
}
const pushImagesBack = function(){
    moleImages.forEach(img=>img.style.bottom = '0px')
}

// const hammer = function(e){
//     hammerImage.style.transform = 'rotate(0deg)'
//     hammerImage.style.top = `${e.clientY}px`
//     hammerImage.style.left = `${e.clientX}px`
// }
holeContainer.addEventListener('click', getHoleClick)
showMole()
// holeContainer.addEventListener('mousemove',hammer)

restartButton.addEventListener('click',restartGame)
timeoutShowMole = setInterval(showMole, 700)