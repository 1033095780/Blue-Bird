const mem = require("memoryjs");
const sks = require("asynckeystate");
const settings = require("../settings.json");

module.exports.execute = async function(offsets) {
    var dwLocalPlayer = mem.readMemory(offsets.temp.dwClientDllBaseAddress + offsets.dwLocalPlayer, "int");
    var iFlags = mem.readMemory(dwLocalPlayer + offsets.m_fFlags, "int");
    if (sks.getAsyncKeyState(0x20)) {
        mem.writeMemory(offsets.temp.dwClientDllBaseAddress + offsets.dwForceJump, ((iFlags==257) || (iFlags==263)) ? 5 : 4, "int");
    }
}

module.exports.settings = {
    delay: 5,
    enabled: settings.bhop.enabled
}