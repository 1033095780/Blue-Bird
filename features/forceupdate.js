const mem = require("memoryjs");
const sks = require("asynckeystate");
const sleep = require("sleep");
const settings = require("../settings.json");

module.exports.execute = async function (offsets) {
    if (sks.getAsyncKeyState(0x70)) {
        sleep.msleep(200);
        var dwClientState = mem.readMemory(offsets.temp.dwEngineDllBaseAddress + offsets.dwClientState, "int");
        mem.writeMemory(dwClientState + offsets.dwFullUpdate, -1, "int");
        console.log("ok");
    }
}

module.exports.settings = {
    delay: 1,
    enabled: settings.forceupdate.enabled
}