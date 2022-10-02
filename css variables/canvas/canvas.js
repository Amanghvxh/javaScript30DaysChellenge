'use strict'
const canvas = document.querySelector('canvas')
const canvasAll = document.querySelectorAll('.canvas')
const canvasContainer = document.querySelector('.canvas_container')
const colour = document.querySelector('.colour')
const brushRangeText = document.querySelector('.brushSize')
const brushRange = document.querySelector('.brush_size')
const brushButton = document.querySelector('.brush_button')
const canvasBackground = document.querySelector('.canvas_background')
const colourPicker = document.querySelector('.canvas_background_picker')
const eraser = document.querySelector('.eraser_button')
const eraserRange = document.querySelector('.eraser_size')
const eraserRangeText = document.querySelector('.eraserSize')
const downloadButton = document.querySelector('.download_button')
const exportContainer = document.querySelector('.export_container')
const addCanvasButton = document.querySelector('.add_canvas')
const deleteBtn = document.querySelectorAll('.delete_btn')
const canvasButton = document.querySelectorAll('.canvas_button')
const canvasButtonContainer = document.querySelector('.canvas_button_container')
// const photoshopContainer = document.querySelector('.photoshop_container')
const mainContainer = document.querySelector('.main_container')
canvas.width = canvas.offsetWidth
canvas.height = canvas.offsetHeight
const ctx = canvas.getContext('2d')
const position = canvas.getBoundingClientRect()

let x, y, radius = brushRange.value, layerX, layerY, isSelected = false, isErasing = false,
    currentTool, totalCanvas = 1, interval, currentCanvas = +canvas.dataset.currentcanvas, isImage = false

let saveCanvasData = new Map()
let saveGlobalComposition = new Map()
let saveFillStyle = new Map()
let mapRedo = new Map()
brushRangeText.innerText = `Size=${brushRange.value}`
eraserRangeText.innerText = `Size=${eraserRange.value}`

eraser.value = '#FFFFFF'


let isDrawing = false

const start = function (e) {
    if (!isSelected) return
    isDrawing = true
    ctx.beginPath()
    ctx.moveTo(e.clientX - position.x, e.clientY - position.y)
}

const drawCircle = function (e) {
    if (!isDrawing) return
    ctx.lineTo(e.clientX - position.x, e.clientY - position.y)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = isErasing ? eraserRange.value : brushRange.value
    ctx.strokeStyle = isErasing ? eraser.value : colour.value
    ctx.stroke()
}

const brush = function () {
    brushRangeText.innerText = `Size=${brushRange.value}`
    radius = brushRange.value
}
const brushButtonClick = function () {
    displayNone()
    if (currentTool === 'brush') return currentTool = ''
    isSelected = !isSelected
    brushRange.classList.toggle('brush_visible')
    brushRangeText.classList.toggle('brush_visible')
    currentTool = 'brush'
}

const stopDrawing = function () {
    isDrawing = false
    ctx.closePath()
}

const displayNone = function () {
    brushRange.classList.remove('brush_visible')
    brushRangeText.classList.remove('brush_visible')
    eraserRange.classList.remove('brush_visible')
    eraserRangeText.classList.remove('brush_visible')

    //Logic for actually preventing an element to be selected
    isSelected = false
    isErasing = false
}

const eraserButtonClick = function () {
    displayNone()
    if (currentTool === 'eraser') return currentTool = ''
    isErasing = !isErasing
    isSelected = !isSelected
    eraserRange.classList.toggle('brush_visible')
    eraserRangeText.classList.toggle('brush_visible')
    currentTool = 'eraser'
}
const erase = function () {
    if (!isErasing) return
    ctx.fillStyle = eraser.value
    radius = eraserRange.value
    eraserRangeText.innerText = `Size=${eraserRange.value}`
}

const storeCompositeOperationAndMakeRect = function () {
    //save image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    //save global composite operation
    const savedGlobalCompositeOperation = ctx.globalCompositeOperation
    //setting global composite operation 'over' the canvas
    ctx.globalCompositeOperation = 'destination-over'
    //fill rectangle with background colour
    ctx.fillStyle = eraser.value
    //create a rectangle
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    return [savedGlobalCompositeOperation, imageData]
}


const revertingToOriginalImageAndClearingCanvas = function (savedOperation, imageData) {
    //clearing canvas to blank 
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    //saving original image data to canvas again
    ctx.putImageData(imageData, 0, 0)
    //saving the global compostie operation back to it's original form
    ctx.globalCompositeOperation = savedOperation

}

const createCanvasUrl = function (button) {
    const downloadableImage = canvas.toDataURL('image/jpeg', 1)
    button.href = downloadableImage
    button.download = `canvas-madeByAman-(${time * 1.5}).jpeg`
}
const download = function () {
    const time = new Date().getMilliseconds()
    const [savedGlobalCompositeOperation, imageData] = storeCompositeOperationAndMakeRect()
    createCanvasUrl(downloadButton)
    revertingToOriginalImageAndClearingCanvas(savedGlobalCompositeOperation, imageData)
}

const getCanvasData = function () {
    const canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const globalComposition = ctx.globalCompositeOperation
    return [canvasData, globalComposition, eraser.value]
}

const updateCanvasData = function (e) {
    const buttonNum = +e.target.dataset.canvasbuttonnum
    savingCanvasData(buttonNum)
}

const savingCanvasData = function (data) {
    canvasButton.forEach(btn => {
        if (totalCanvas === 1) btn.style.display = 'none'
        else btn.style.display = 'inline-block'
    })
    const [canvasData, globalComposition, fillStyleValue] = getCanvasData()
    saveCanvasData.set(+data, canvasData)
    saveGlobalComposition.set(+data, globalComposition)
    saveFillStyle.set(+data, fillStyleValue)
}

const createButtonElement = function () {
    const canvasButton = document.createElement('div')
    const canvasNum = document.createElement('p')
    const deleteBtn = document.createElement('span')
    canvasButton.dataset.canvasbuttonnum = totalCanvas
    canvasButton.classList.add('canvas_button')
    if (isImage) canvasButton.classList.add('is_image')
    deleteBtn.classList.add('delete_btn')
    canvasNum.classList.add('canvas_number')
    canvasNum.innerText = `Canvas-${totalCanvas}`
    deleteBtn.innerText = '✖'

    return [canvasButton, canvasNum, deleteBtn]
}

const appendButton = function (canvasButton, canvasNum, deleteBtn) {
    canvasButtonContainer.insertAdjacentElement('beforeend',canvasButton)
    canvasButton.insertAdjacentElement('afterbegin', canvasNum)
    canvasButton.insertAdjacentElement('beforeend', deleteBtn)
}
const generateCanvas = function () {

    totalCanvas++

    savingCanvasData(currentCanvas)

    const [canvasButton, canvasNum, deleteBtn] = createButtonElement()


    currentCanvas = canvas.dataset.currentcanvas = totalCanvas


    eraser.value = "#FFFFFF"
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    savingCanvasData(currentCanvas)
    canvas.style.background = eraser.value
    canvasBackground.style.background = eraser.value



    appendButton(canvasButton, canvasNum, deleteBtn)



    console.log(saveCanvasData, saveGlobalComposition, saveFillStyle)

}

const reOrderingMaps = function (map) {
    let tempMap = new Map()
    let count = 1
    for (let [key, value] of map) {
        tempMap.set(count, value)
        count++
    }
    if (map === saveCanvasData) saveCanvasData = new Map(tempMap)
    if (map === saveFillStyle) saveFillStyle = new Map(tempMap)
    if (map === saveGlobalComposition) saveGlobalComposition = new Map(tempMap)

}

const putImageDataToCanvas = function (buttonNum) {
    let color = saveFillStyle.get(buttonNum)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    console.log(eraser.value)
    eraser.value = color
    console.log(eraser.value)
    canvas.style.background = color
    ctx.globalCompositeOperation = saveGlobalComposition.get(buttonNum)
    ctx.putImageData(saveCanvasData.get(buttonNum), 0, 0)
    canvasBackground.style.background = color
}
const switchCanvas = function (e) {
    if (!e.target.closest('.canvas_button')) return
    const canvasButton = e.target.closest('.canvas_button')
    savingCanvasData(currentCanvas)
    const buttonNum = +canvasButton.dataset.canvasbuttonnum
    currentCanvas = buttonNum
    putImageDataToCanvas(buttonNum)
}
const deleteBtnVisible = function (e) {
    if (!e.target.closest('.canvas_button')) return
    let parent = e.target.closest('.canvas_button')
    let btn = parent.lastElementChild
    btn.style.display = 'inline-block'
}
const deleteBtnHide = function (e) {
    if (!e.target.closest('.canvas_button')) return
    let parent = e.target.closest('.canvas_button')
    let btn = parent.lastElementChild
    btn.style.display = 'none'
}

const deleteCanvas = function (e) {
    if (!e.target.classList.contains('delete_btn')) return
    const parentButton = e.target.closest('.canvas_button')
    const buttonNum = +parentButton.dataset.canvasbuttonnum
    //saving current canvas to prevent data loss
    savingCanvasData(currentCanvas)
    //saving the deleted Canvas
    mapRedo.set(totalCanvas, [saveCanvasData.get(buttonNum), saveFillStyle.get(buttonNum), saveGlobalComposition.get(buttonNum)])

    //delete canvas data from maps
    saveCanvasData.delete(buttonNum)
    saveFillStyle.delete(buttonNum)
    saveGlobalComposition.delete(buttonNum)

    //removing element
    parentButton.remove()

    //decrease total canvas
    totalCanvas--

    const canvasButtons = document.querySelectorAll('.canvas_button')

    //reordering data after delete
    canvasButtons.forEach((btn, i) => {
        const btnNum = +btn.dataset.canvasbuttonnum
        if (i === 0) { putImageDataToCanvas(btnNum), currentCanvas = 1 }
        btn.dataset.canvasbuttonnum = i + 1
        btn.firstElementChild.innerText = `Canvas-${i + 1}`
    })

    //reordering maps after delete
    reOrderingMaps(saveCanvasData)
    reOrderingMaps(saveFillStyle)
    reOrderingMaps(saveGlobalComposition)


    console.log(mapRedo)
}

const redo = function (e) {

    if (!e.target.classList.contains('redo')) return
    if (mapRedo.size == 0) return

    //incrementing total canvas size by 1
    totalCanvas++
    //setting canvas deleted canvas again to respective (Maps)
    const [imageData, fillStyleCanvas, globalComposition] = mapRedo.get(totalCanvas)
    saveCanvasData.set(totalCanvas, imageData)
    saveFillStyle.set(totalCanvas, fillStyleCanvas)
    saveGlobalComposition.set(totalCanvas, globalComposition)

    //deleting saved redo
    mapRedo.delete(totalCanvas)
    //generate button element
    const [canvasButton, canvasNum, deleteBtn] = createButtonElement()
    appendButton(canvasButton, canvasNum, deleteBtn)

    //setting current canvas to new one
    currentCanvas = totalCanvas

    //putting image data back to canvas
    putImageDataToCanvas(currentCanvas)

    console.log(mapRedo)

}

const transferCanvas = function () {
    //saving current canvas data to prevent dataLoss
    savingCanvasData(currentCanvas)
    //creating link of current canvas
    const [savedGlobalCompositeOperation, imageData] = storeCompositeOperationAndMakeRect()
    const transferableCanvasUrl = canvas.toDataURL('image/jpeg', 1)
    revertingToOriginalImageAndClearingCanvas(savedGlobalCompositeOperation, imageData)
    localStorage.setItem('canvas', JSON.stringify(transferableCanvasUrl))
}

const recieveCanvasData = function () {

    //telling javaScript to create a button distinctive to canvas only
    isImage = true
    //saving current canvas data to prevent data loss
    savingCanvasData(currentCanvas)
    /////////////////////////////////////////////////////////////////
    // this is just an example data (not real data)//////////////////
    // const dataImage = saveCanvasData.get(currentCanvas)///////////
    // const dataFillStyle = saveFillStyle.get(currentCanvas)////////
    // const dataGlobalComposition = saveFillStyle.get(currentCanvas)
    /////////////////////////////////////////////////////////////////
    // getting data from localStroage
    let data = localStorage.getItem('Image')
    data = JSON.parse(data)
    const [dataImage, dataGlobalComposition, dataFillStyle] = data
    //incrementing totalCanvas size by 1
    totalCanvas++

    //saving new Image data to canvas data 
    saveCanvasData.set(totalCanvas, dataImage)
    saveFillStyle.set(totalCanvas, dataFillStyle)
    saveGlobalComposition.set(totalCanvas, dataGlobalComposition)

    //displaying Image data to current canvas
    //generating new button for Image data
    const [canvasButton, canvasNum, deleteBtn] = createButtonElement()
    appendButton(canvasButton, canvasNum, deleteBtn)

    //setting current canvas to new one
    currentCanvas = totalCanvas

    //putting image data back to canvas
    putImageDataToCanvas(totalCanvas)

    localStorage.clear()
}


canvas.addEventListener('mousedown', start)
canvas.addEventListener('mouseup', stopDrawing)
canvas.addEventListener('mousemove', drawCircle)

brushButton.addEventListener('click', brushButtonClick)
brushRange.addEventListener('change', brush)

eraser.addEventListener('click', eraserButtonClick)
eraserRange.addEventListener('change', erase)

colourPicker.onchange = () => {
    canvasBackground.style.background = colourPicker.value
    canvas.style.background = colourPicker.value
    eraser.value = colourPicker.value
}


canvasBackground.addEventListener('click', async function (e) {
    colourPicker.style.display = 'inline-block';
    await colourPicker.click();
    colourPicker.style.display = 'none'
})

downloadButton.addEventListener('click', download)
addCanvasButton.addEventListener('click', generateCanvas)

exportContainer.addEventListener('click', switchCanvas)
exportContainer.addEventListener('mouseover', deleteBtnVisible)
exportContainer.addEventListener('mouseout', deleteBtnHide)
exportContainer.addEventListener('click', deleteCanvas)
exportContainer.addEventListener('click', redo)
// transferButton.addEventListener('click', recieveCanvasData)  
savingCanvasData(currentCanvas)