export function CalculateImageSize(imageSize, screenSize) {

    if (calculateHeightImage(imageSize, screenSize) > screenSize.height) {
        return {
            width: calculateWidthImage(imageSize, screenSize),
            height: screenSize.height,
        }
    } else {
        return {
            width: screenSize.width,
            height: calculateHeightImage(imageSize, screenSize) > screenSize.height ? screenSize.height : calculateHeightImage(imageSize, screenSize)
        }
    }
}

function calculateHeightImage(imageSize, screenSize) {
    return imageSize.height * screenSize.width / imageSize.width
}

function calculateWidthImage(imageSize, screenSize) {
    return screenSize.height * imageSize.width / imageSize.height;
}

/**
 * @return {number}
 */
export function ScaleChecker(imageSize, FrameSize) {

    if (scaleWidth(imageSize, FrameSize) * imageSize.width === FrameSize.width && scaleWidth(imageSize, FrameSize) * imageSize.height > FrameSize.height) {
        return scaleWidth(imageSize, FrameSize)
    } else {
        return scaleHeight(imageSize, FrameSize)
    }
}

function scaleWidth(imageSize, FrameSize) {
    return FrameSize.width / imageSize.width
}

function scaleHeight(imageSize, FrameSize) {
    return FrameSize.height / imageSize.height
}

export function CalculateLimit(imageSize, frameSize, scale) {
    if (imageSize.width * scale === frameSize.width && imageSize.height * scale === frameSize.height) {
        return {width: 0, height: 0}
    } else if (imageSize.width * scale === frameSize.width && imageSize.height * scale > frameSize.height) {
        return {width: 0, height: (imageSize.height * scale - frameSize.height) / 2}
    } else if (imageSize.height * scale === frameSize.height && imageSize.width * scale > frameSize.width) {
        return {width: (imageSize.width * scale - frameSize.width) / 2, height: 0}
    } else {
        return {
            width: (imageSize.width * scale - frameSize.width) / 2,
            height: (imageSize.height * scale - frameSize.height) / 2
        }
    }
}


export function transitionChecker(imageSize, FrameSize, scale) {
    if (imageSize.width * scale === FrameSize.width && imageSize.height * scale === FrameSize.height) {
        return ''
    } else if (imageSize.width * scale === FrameSize.width && imageSize.height * scale > FrameSize.height) {
        return 'y'
    } else if (imageSize.height * scale === FrameSize.height && imageSize.width * scale > FrameSize.width) {
        return 'x'
    } else {
        return 'xy'
    }
}
