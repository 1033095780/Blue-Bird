const mem = require("memoryjs");
const sks = require("asynckeystate");
const settings = require("../settings.json");

module.exports.execute = async function(offsets) {
    if (sks.getAsyncKeyState(0x74)) {
        var dwClientState = memory.readMemory(offsets.temp.dwClientDllBaseAddress + offsets.dwClientState, "int");
        mem.writeMemory(dwClientState + offsets.dwFullUpdate, -1, "int");
    }
}

module.exports.settings = {
    delay: 200,
    enabled: settings.forceupdate.enabled
}