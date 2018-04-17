const mem = require("memoryjs");
const sks = require("asynckeystate");
const sleep = require("sleep");
const settings = require("../settings.json");

module.exports.execute = function (offsets) {
    var dwLocalPlayer = mem.readMemory(offsets.temp.dwClientDllBaseAddress + offsets.dwLocalPlayer, "int");
    var iLocalPlayerTeam = mem.readMemory(dwLocalPlayer + offsets.m_iTeamNum, "int");
    var iCrosshair = mem.readMemory(dwLocalPlayer + offsets.m_iCrosshairId, "int");
    var dwEntity = mem.readMemory(offsets.temp.dwClientDllBaseAddress + offsets.dwEntityList + (iCrosshair - 1) * offsets.m_EntLoopDist, "int");
    var iEntityHealth = mem.readMemory(dwEntity + offsets.m_iHealth, "int");
    var iEntityTeam = mem.readMemory(dwEntity + offsets.m_iTeamNum, "int");

    if (iLocalPlayerTeam != iEntityTeam && iEntityHealth > 0 && iCrosshair >= 1 && iCrosshair < 65) {
        if (sks.getAsyncKeyState(0x58)) {
            sleep.msleep(settings.triggerbot.delay)
            mem.writeMemory(offsets.temp.dwClientDllBaseAddress + offsets.dwForceAttack, 5, "int");
            sleep.msleep(1);
            mem.writeMemory(offsets.temp.dwClientDllBaseAddress + offsets.dwForceAttack, 4, "int");
        }
    }
}

module.exports.settings = {
    delay: 5,
    enabled: settings.triggerbot.enabled
}