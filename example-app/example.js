loadSimpleIO().then(loadConfig).then(config => {
    let openInventory = config['CustomInputSettins']['ActionKeyList']
                            .find(action => action['ActionName'] === 'ToggleInventory')
    console.log(openInventory['Keys'])
    console.log('All configuration options:')
    console.log(config)
})

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