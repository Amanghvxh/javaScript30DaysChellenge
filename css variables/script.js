'use strict'
const inputBlur = document.getElementById('blur')
const inputSpacing = document.getElementById('spacing')
const inputColour = document.getElementById('colour')
const imageToEdit = document.querySelector('.image')
const inputInvert = document.getElementById('invert')
const inputBrightness = document.getElementById('brightness')
const inputContrast = document.getElementById('contrast')
const inputGreyscale = document.getElementById('greyscale')
const inputOpacity = document.getElementById('opacity')
const inputSaturation = document.getElementById('saturation')
const inputSepia = document.getElementById('sepia')
const inputHueRotation = document.getElementById('hue_rotation')
const root = document.querySelector(':root')
const uploadedFile = document.querySelector('#file_id')
const downloadBtn = document.querySelector('.download_btn')
const mainContainer = document.querySelector('.main_container')
const uploadFileContainer = document.querySelector('.upload_file_label')
const addImageBtn = document.querySelector('.addImageBtn')
const exportSection = document.querySelector('.export_options')
// const transferButton = document.querySelector('.transfer_button')

let imageCount = 0
let saveImageSrc = new Map()
let saveFilterValues = new Map()
let isCanvas = false

const inputsArray = [
    inputBlur,
    inputBrightness,
    inputGreyscale,
    inputSaturation,
    inputInvert,
    inputOpacity,
    inputContrast,
    inputHueRotation,
    inputSepia,
]

    
const processUploadedFile = function(e){
    imageCount++
    const url = URL.createObjectURL(e.target.files[0])
    if(!url) return 
    mainContainer.style.display = 'initial'
    imageToEdit.src = url
    uploadFileContainer.style.display = 'none'
    saveImageSrc.set(imageCount,url)
    generateHtml()
    hideUnhideImageBtn()
}
const hideUnhideImageBtn = function(){
    const imageBtn = document.querySelectorAll('.addedImageHtml')
    if(imageCount === 1) return
    imageBtn.forEach(btn=>btn.style.display =  'inline-block')
}
const applySavedFilter = function(currentImage){
    let value = saveFilterValues.get(currentImage)
    root.style.setProperty('--blur',`${value[0]}px`)
    root.style.setProperty('--brightness',`${value[1]}%`)
    root.style.setProperty('--grayscale',`${value[2]}%`)
    root.style.setProperty('--saturation',`${value[3]}%`)
    root.style.setProperty('--invert',`${value[4]}%`)
    root.style.setProperty('--opacity',`${value[5]}%`)
    root.style.setProperty('--contrast',`${value[6]}%`)
    root.style.setProperty('--hue-rotate',`${value[7]}deg`)
    root.style.setProperty('--sepia',`${value[8]}%`)
}

const blurEdit = function(e){
    const value = e.target.value
    root.style.setProperty('--blur',`${value}px`)
}

const spacingEdit = function(e){
    const value = +e.target.value
    imageToEdit.style.padding = `${value}px`
    imageToEdit.style.width = `${600-(value*5)}px`
    imageToEdit.style.height = `${400-(value*2.5)}px`
    imageToEdit.style.marginLeft = `${95+value}px`

}

const backgroundEdit = function(e){
    const value = e.target.value
    imageToEdit.style.backgroundColor = value
}

const brightnessEdit = function(e){
    const value = e.target.value
    root.style.setProperty('--brightness',`${value}%`)
}

const grayscaleEdit = function(e){
    const value = e.target.value
    root.style.setProperty('--grayscale',`${value}%`)
}

const saturationEdit = function(e){
    const value = e.target.value
    root.style.setProperty('--saturation',`${value}%`)
}

const invertEdit = function(e){
    const value = e.target.value
    root.style.setProperty('--invert',`${value}%`)
}

const opacityEdit = function(e){
    const value = e.target.value
    root.style.setProperty('--opacity',`${value}%`)
}

const contrastEdit = function(e){
    const value = e.target.value
    root.style.setProperty('--contrast',`${value}%`)
}

const hueRotationEdit = function(e){
    const value = e.target.value
    root.style.setProperty('--hue-rotate',`${value}deg`)
}
const sepiaEdit = function(e){
    const value = e.target.value
    root.style.setProperty('--sepia',`${value}%`)
}

const createTempCanvas = function(){
    const canvas = document.createElement('canvas')
   canvas.width = 600
   canvas.height = 400 
   const ctx =  canvas.getContext('2d')
   let imageStyle = getComputedStyle(imageToEdit) 
   const filterString = imageStyle.getPropertyValue('filter')
   console.log(filterString)
   ctx.filter = filterString
   ctx.drawImage(imageToEdit,0,0,imageToEdit.width,imageToEdit.height)
   return [ctx,canvas]
}

const downloadImage = function(){
   const [ctx,canvas] = createTempCanvas()
   const finalSrc = canvas.toDataURL('image/jpeg', 1)
   downloadBtn.download = 'test.jpeg'
   downloadBtn.href = finalSrc
   canvas.remove()
}


const generateHtml = function(){
    //we need to update current image because we will need to reset the lever values before
    //creating adding a new image so we will update current image's filter values before reseting it
    //↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
    //updating currentImage ---> (image that we are actively editing) --- filter values 
    const currentImage = +imageToEdit.dataset.currentimage??false;//<----using false because if it
    //first most image we are adding than there will be (NAN) saved in the map so to avoid that 
    //false is being used
    //updaing current image filter value↓↓↓
    updateFilterValuesToMap(currentImage)
    //generating a dynamic button to let user access images!
    const imageBtn = document.createElement('button')
    const delteImageBtn = document.createElement('span')
    const buttonText = document.createElement('span')
    buttonText.classList.add('buttonText')
    delteImageBtn.classList.add('deleteImage')
    imageBtn.classList.add('addedImageHtml')
    if(isCanvas)imageBtn.classList.add('is_canvas')
    //setting the count on image link to (1.Link data with DOM and 2.keep track of total images addded)
    imageBtn.dataset.imagenum = imageCount
    //current image is the image we are currently editing
    //updating current image to the new image we are adding
    imageToEdit.dataset.currentimage = imageCount
    delteImageBtn.dataset.imagenum = imageCount
    //Allowing users to see the respective image a button holds (images are sorted in ascending order
    //and oldest in the top and newest in the very bottom)
    buttonText.innerText = `Image-${imageCount}`
    delteImageBtn.innerText = '✖'

    /////////////////////////////////////
    //reseting levers for the new image
    resetFilterValues()
    //updating new image levers with default values
    const currentImageAgain = +imageToEdit.dataset.currentimage
    updateFilterValuesToMap(currentImageAgain)
    //applying default filter values to new image
    applySavedFilter(currentImageAgain)
    /////////////////////////////////////
    
    exportSection.insertAdjacentElement('beforeend',imageBtn)
    console.log(delteImageBtn)
    delteImageBtn.onclick = deleteImage
    callFunctions(imageBtn)
    imageBtn.insertAdjacentElement('afterbegin',buttonText)
    imageBtn.insertAdjacentElement('beforeend',delteImageBtn)

    isCanvas = false

}

const callFunctions = (imageBtn)=>{
    imageBtn.onmouseenter = displayDeleteBtn
    imageBtn.onmouseleave = hideDeleteBtn
}

const switchImage = function(e){
    if(!e.target.closest('.addedImageHtml'))return
    const element = e.target.closest('.addedImageHtml')
    const imageNum = +element.dataset.imagenum
    const currentImage = +imageToEdit.dataset.currentimage
    if(currentImage===imageNum) return
    imageToEdit.src = saveImageSrc.get(imageNum)
    //save prevImage filters
        updateFilterValuesToMap(currentImage)

    //adjust curImage levers and apply respective filters to image 
        adjustLevers(imageNum)
    imageToEdit.dataset.currentimage = imageNum
    console.log('clicked')
}

const adjustLevers = function(imageNum){
    const valueArray = saveFilterValues.get(imageNum) 
        for(let i = 0;i<inputsArray.length;i++){
            inputsArray[i].value = +valueArray[i]
        }
        applySavedFilter(imageNum)
}

const displayDeleteBtn = (e)=>{
    let btn = e.target.lastChild
    console.log(e,btn)
    btn.style.display = 'inline'
    
}
const hideDeleteBtn = (e)=>{
    let btn = e.target.lastChild
    btn.style.display = 'none'
}
const resetFilterValues = function(){
    inputBlur.value =  0
    inputBrightness.value = 100
    inputContrast.value = 100
    inputGreyscale.value = 0
    inputHueRotation.value = 0
    inputInvert.value = 0
    inputOpacity.value = 100
    inputSaturation.value = 100
    inputSepia.value = 0
    inputSpacing.value = 0
}


const updateFilterValuesToMap = function(imageNum){
    if(!imageNum)return
   saveFilterValues.set(imageNum,
    [inputBlur.value,
        inputBrightness.value,
        inputGreyscale.value,
        inputSaturation.value,
        inputInvert.value,
        inputOpacity.value,
        inputContrast.value,
        inputHueRotation.value,
        inputSepia.value]
   )
}

const deleteImage = function(e){
    const imageBtn = e.target.closest('.addedImageHtml')
    
    //saving current image filter values
    const currentImage = +imageToEdit.dataset.currentimage 
    updateFilterValuesToMap(currentImage)
    //deleting values from Map
    
        const imageNum = +imageBtn.dataset.imagenum
        saveImageSrc.delete(imageNum)
        saveFilterValues.delete(imageNum)
        //decrementing total images count by (one)
        imageCount--
        //removing image button
        imageBtn.remove()

    const imageBtns = document.querySelectorAll('.addedImageHtml')
    
    

    console.log(imageBtns)

    imageBtns.forEach((btn,i)=>{
        //setting url of different image 
    if(i===0) {
        const imageNum = +btn.dataset.imagenum
        imageToEdit.src = saveImageSrc.get(imageNum)
        imageToEdit.dataset.currentimage = imageNum
        adjustLevers(imageNum)
    }
        //checking if only one image is present or not if yes! (hide it.)
        if(imageCount===1) {
            e.target.style.display = 'none'
            btn.style.display = 'none'
        }
        //updating image numbers
          btn.dataset.imagenum = i+1
        //updating current number of image 
          btn.firstElementChild.innerText = `Image-${i+1}`
        //why append dosent worked -----> needed to clarify!
        // btn.appendChild(e.target)
    })
    //updating image src values in map
    updateMap(saveImageSrc)
    //uppdate filter values in map
    updateMap(saveFilterValues)
}

const updateMap = function(map){
    const tempMap = new Map()
    let i = 1
    for(let [key,value]of map){
        tempMap.set(i,value)
        i++
    }
    if(map==saveFilterValues) saveFilterValues = new Map(tempMap)
    else saveImageSrc = new Map(tempMap)
}

const recieveCanvasData = function(){
    let data = localStorage.getItem('canvas')
    data  = JSON.parse(data)
    isCanvas = true
    imageCount++
    saveImageSrc.set(imageCount,data)
    imageToEdit.src = saveImageSrc.get(imageCount)
    generateHtml()
    hideUnhideImageBtn()
    localStorage.clear()
}

const transferImag = function(){
    const [ctx,canvas] = createTempCanvas()
    const imageData = ctx.getImageData(0,0,canvas.width,canvas.height)
    const globalComposition = ctx.globalCompositeOperation
    const fillStyle = 'transparent'
    console.log( imageData,globalComposition,fillStyle)
    // const {data} = imageData
    let {width,height,data} = imageData
    console.log(width,height,data)
    localStorage.setItem('Image',JSON.stringify([globalComposition,fillStyle]))
    localStorage.setItem('ImageObject',JSON.stringify([width,height,data]))
    canvas.remove()
}

inputBlur.addEventListener('change',blurEdit)
inputSpacing.addEventListener('change',spacingEdit)
inputColour.addEventListener('change',backgroundEdit)
inputBrightness.addEventListener('change',brightnessEdit)
inputContrast.addEventListener('change',contrastEdit)
inputSaturation.addEventListener('change',saturationEdit)
inputGreyscale.addEventListener('change',grayscaleEdit)
inputOpacity.addEventListener('change',opacityEdit)
inputInvert.addEventListener('change',invertEdit)
inputSepia.addEventListener('change',sepiaEdit)
inputHueRotation.addEventListener('change',hueRotationEdit)
uploadedFile.addEventListener('change',processUploadedFile)
downloadBtn.addEventListener('click',downloadImage)
addImageBtn.addEventListener('change',processUploadedFile)
exportSection.addEventListener('click',switchImage)
// transferButton.addEventListener('click',recieveCanvasData)
const imgbtns = document.querySelectorAll('.addedImageHtml')

       