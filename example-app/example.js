loadSimpleIO().then(loadConfig).then(console.log)

async function loadSimpleIO() {
    let io = null
    overwolf.extensions.current.getExtraObject('simple-io-plugin', res => {
        if (res.status === 'success') {
            io = res.object
        } else {
            throw new Error('unable to get simpleIO: ' + res.status)
        }
    })
    return new Promise((resolve, reject) => {
        let checkPluginLoaded = () => {
            if (io) {
                return resolve(io)
            } else {
                setTimeout(checkPluginLoaded, 20)
            }
        }
        checkPluginLoaded()
    })
}