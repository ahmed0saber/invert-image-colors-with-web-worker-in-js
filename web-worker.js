self.onmessage = (event) => {
    const message = event.data
    if (message.type === "invert-image") {
        for (let i = 0; i < message.imageData.data.length; i += 4) {
            const r = message.imageData.data[i] // Red color lies between 0 and 255
            const g = message.imageData.data[i + 1] // Green color lies between 0 and 255
            const b = message.imageData.data[i + 2] // Blue color lies between 0 and 255
            const a = message.imageData.data[i + 3] // Transparency lies between 0 and 255

            const invertedRed = 255 - r
            const invertedGreen = 255 - g
            const invertedBlue = 255 - b

            message.imageData.data[i] = invertedRed
            message.imageData.data[i + 1] = invertedGreen
            message.imageData.data[i + 2] = invertedBlue
        }

        postMessage(message.imageData)
    }
}