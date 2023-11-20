const youtubePattern = /^https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/

let hasReplacedVideo = false;
let currentVideoId = null

function createEmbedHtml (videoId, dimensions) {
    return `<iframe id='ivplayer' width='${dimensions.width}' height='${dimensions.height}' src='https://yewtu.be/embed/${videoId}' style='border:none;'></iframe>`
}

// Calculate the width based on the "contents" element's width
function getDimensions () {
    const contentsElement = document.getElementById('contents')
    if (!contentsElement) {
        return null
    }
    const width = contentsElement.offsetWidth
    if (width <= 0) {
        return null
    }
    const aspectRatio = 16 / 9
    const height = width / aspectRatio
    return { width, height }
}

function replaceVideoWithEmbed() {
    const match = youtubePattern.exec(window.location.href)
    if (!match) {
        return
    }
    const videoId = match[1];
    if (currentVideoId !== videoId) {
        hasReplacedVideo = false;
    }
    if (hasReplacedVideo) {
        return
    }

    const dimensions = getDimensions()
    if (!dimensions) {
        return
    }

    const container = document.querySelector('yt-playability-error-supported-renderers')
        || document.getElementById('ivplayer')
    if (!container) {
        return
    }

    const player = document.getElementById('player')
    player.innerHTML = createEmbedHtml(videoId, dimensions)
    hasReplacedVideo = true
    currentVideoId = videoId
}

const observer = new MutationObserver(replaceVideoWithEmbed)

observer.observe(document.body, { childList: true, subtree: true })

window.addEventListener('resize', () => {
    const p = document.getElementById('ivplayer')
    if (p) {
        setTimeout(() => {
            const dimensions = getDimensions()
            if (!dimensions) {
                return
            }
            p.setAttribute('width', dimensions.width)
            p.setAttribute('height', dimensions.height)
        }, 10)
    }
})

replaceVideoWithEmbed()
