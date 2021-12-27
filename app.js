const urlParams = new URLSearchParams(window.location.search)
let chatDuration = parseInt(urlParams.get('messageduration'))
let chatColor
if (/^#[0-9A-F]{6}$/i.test(`#${urlParams.get('chatcolor')}`)) {
    chatColor = `#${urlParams.get('chatcolor')}`
}

function addChat(chatObj) {
    let fontSize = (chatObj.fontSize) ? chatObj.fontSize : Math.floor(10+Math.random()*20)
    let duration = (chatObj.duration) ? chatObj.duration : 20
    let chatElement = document.createElement('div')
    chatElement.className = 'chat'
    chatElement.setAttribute('id', Date.now())
    let colorCSS = (chatColor) ? `color: ${chatColor};` : ''
    chatElement.setAttribute('style', `${colorCSS} font-size: ${fontSize}px; top: ${Math.floor(Math.random()*(innerHeight-50))}px; animation-duration: ${duration}s`)
    let id = chatElement.getAttribute('id')
    chatElement.innerHTML = `<p class="username">${chatObj.username}</p><p class="message">${chatObj.message}</p>`
    setTimeout(() => {
        document.getElementById(id).remove()
    }, duration*1000)
    document.body.appendChild(chatElement)
}

const client = new tmi.Client({
	channels: [ urlParams.get('streamer') ]
})

client.connect()

setTimeout(() => {
    if (client.channels.length==0) {
        addChat({
            username: 'error',
            message: 'Could not connect to this Twitch channel. Make sure that you have entered the url correctly!',
            fontSize: 30,
            duration: chatDuration
        })
    }
}, 2000)

client.on('message', (channel, tags, message, self) => {
    addChat({
        username: tags['display-name'],
        message: message,
        duration: chatDuration
    })
})