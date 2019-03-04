/**
 * Load the PUBG config file and return the configuration settings in an object wrapped in a promise.
 * 
 * @param ioPlugin The simple-io-plugin (or simple-io-plugin fork) instance. 
 */
async function loadConfig(ioPlugin) {
    let config = null
    let loc = ioPlugin.LOCALAPPDATA + '/TslGame/Saved/Config/WindowsNoEditor/GameUserSettings.ini'
    ioPlugin.getTextFile(loc, false, (status, data) => {
        if (!status) {
            throw Error('unable to load config file')
        } else {
            let parser = new PUBGConfigParser()
            parser.parseLines(data)
            config = parser.contents
        }
    })
    return new Promise((resolve, reject) => {
        let checkConfigLoaded = () => {
            if (config) {
                return resolve(config)
            } else {
                setTimeout(checkConfigLoaded, 20)
            }
        }
        checkConfigLoaded()
    })
}

/**
 * An simple .ini parser designed to parse PUBG's .ini files.
 *
 * Does not comply to all .ini standards; do not use this class for general use cases.
 */
class PUBGConfigParser {
    constructor() {
        this._contents = {}
    }

    get contents() {
        return this._contents
    }

    parseLine(line) {
        line = line.trim()
        if (line === '' || line.startsWith(';') || line.startsWith('[')) {
            return // ignore INI sections and comments
        }
        let objects = [this._contents]
        let currentKey = null
        let buffer = ''
        let quoted = false
        for (let i = 0; i < line.length; i++) {
            let c = line.charAt(i)
            if (c === '"') {
                quoted = !quoted
            } else {
                if (!quoted) {
                    if (c === '=') {
                        currentKey = buffer
                        buffer = ''
                    } else if (c === ',') {
                        // add current key-value (or key-less value) to current object
                        if (currentKey) {
                            objects[objects.length - 1][currentKey] = buffer
                        } else {
                            if (buffer) {
                                this._makeArrayAndPush(objects[objects.length - 1], buffer)
                            }
                        }
                        buffer = ''
                        currentKey = null
                    } else if (c === '(') {
                        let object = {}
                        object['=key'] = currentKey // store key to be placed in parent later
                        objects.push(object)
                        currentKey = null
                    } else if (c === ')') {
                        let object = objects.pop()
                        // add current key-value to current object
                        if (currentKey) {
                            object[currentKey] = buffer
                        } else {
                            if (buffer) {
                                this._makeArrayAndPush(object, buffer)
                            }
                        }
                        // add current object to parent object
                        if (object['=key']) {
                            objects[objects.length - 1][object['=key']] = object
                        } else {
                            this._makeArrayAndPush(objects[objects.length - 1], object)
                        }
                        delete object['=key']
                        buffer = ''
                        currentKey = null
                    } else {
                        buffer += c
                    }
                } else {
                    buffer += c
                }
            }
        }
        if (buffer && currentKey) {
            this._contents[currentKey] = buffer
        }
    }

    parseLines(data) {
        let lines = data.split(/[\r\n]+/)
        lines.forEach(line => this.parseLine(line))
    }

    _makeArrayAndPush(object, value) {
        if (Object.getPrototypeOf(object) !== Array.prototype) {
            Object.setPrototypeOf(object, Array.prototype)
        }
        object.push(value)
    }
}