const canvas = document.querySelector("#canvas")
const context = canvas.getContext("2d", { willReadFrequently: true })
let imageInverter
let startTime

const invertImageWithoutWebWorker = (imageData) => {
    startTime = Date.now()
    for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i] // Red color lies between 0 and 255
        const g = imageData.data[i + 1] // Green color lies between 0 and 255
        const b = imageData.data[i + 2] // Blue color lies between 0 and 255
        const a = imageData.data[i + 3] // Transparency lies between 0 and 255

        const invertedRed = 255 - r
        const invertedGreen = 255 - g
        const invertedBlue = 255 - b

        imageData.data[i] = invertedRed
        imageData.data[i + 1] = invertedGreen
        imageData.data[i + 2] = invertedBlue
    }

    context.putImageData(imageData, 0, 0)
    document.querySelector(".time-taken").textContent = Date.now() - startTime
}

const invertImageWithWebWorker = (imageData) => {
    startTime = Date.now()
    imageInverter.postMessage({
        type: "invert-image",
        imageData: imageData
    })

    imageInverter.onmessage = (event) => {
        context.putImageData(event.data, 0, 0)
        document.querySelector(".time-taken").textContent = Date.now() - startTime
    }
}

function startWorker() {
    if (typeof (Worker) !== "undefined") {
        imageInverter = new Worker("./web-worker.js")
    }
}

const initApp = () => {
    const image = new Image()
    image.src = "my-pic.jpg"
    image.onload = function () {
        canvas.width = image.width
        canvas.height = image.height
        context.drawImage(image, 0, 0)
    }
    startWorker()
    document.querySelector(".with-btn").addEventListener("click", () => {
        const imageData = context.getImageData(0, 0, image.width, image.height)
        invertImageWithWebWorker(imageData)
    })
    document.querySelector(".without-btn").addEventListener("click", () => {
        const imageData = context.getImageData(0, 0, image.width, image.height)
        invertImageWithoutWebWorker(imageData)
    })
}
initApp()
