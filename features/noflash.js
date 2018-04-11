const mem = require("memoryjs");
const sks = require("asynckeystate");
const settings = require("../settings.json");

module.exports.execute = async function(offsets) {
    var dwLocalPlayer = mem.readMemory(offsets.temp.dwClientDllBaseAddress + offsets.dwLocalPlayer, "int");
    var flFlashMaxAlpha = mem.readMemory(dwLocalPlayer + offsets.m_flFlashMaxAlpha, "float");
 
    if (flFlashMaxAlpha > 0.0)
        mem.writeMemory(dwLocalPlayer + offsets.m_flFlfashMaxAlpha, settings.noflash.maxFlash, "float");
}

module.exports.settings = {
    delay: 700,
    enabled: settings.noflash.enabled
}