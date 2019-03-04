# PUBG Configuration File Parser #

A parser for PUBG's configuration file containing keybindings and other game settings.

Designed for use with Overwolf but easily adaptable to other uses if necessary.

## Usage ##

Add `pubg-config.js` to your scripts.

```html
<script src='pubg-config.js' type='text/javascript'></script>
```
Add [Overwolf's **simple-io-plugin**](http://developers.overwolf.com/documentation/sdk/overwolf/plugins/io-plugin/) to your manifest's data section. Be sure to unblock the DLL.

```json
"permissions": ["Extensions"],
"data": {
    "extra-objects": {
        "simple-io-plugin": {
            "file": "simple-io-plugin.dll",
            "class": "overwolf.plugins.SimpleIOPlugin"
        }
    }
}
```

Pass an instance of the IO plugin to the config loader and use the result.

```javascript
let ioPlugin = ... // load the plugin, or see /example-app/example.js for one approach
loadConfig(ioPlugin).then(config => console.log(config)) // print all configuration options
```

Access specific properties or keybindings.

```javascript
// print which keys open the inventory
loadConfig(ioPlugin).then(config => {
    let openInventory = config['CustomInputSettins']['ActionKeyList']
                            .find(action => action['ActionName'] === 'ToggleInventory')
    console.log(openInventory['Keys'])
    // Example output:
    // 0: {Key: "G"}
    // 1: {Key: "Tab"}
})
