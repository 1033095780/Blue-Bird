const mem = require("memoryjs");
const sks = require("asynckeystate");
const settings = require("../settings.json");

var color = {r: 0, g: 0, b: 0, a: 0};

function setRender(offsets, entity, r, g, b, a) {
    mem.writeMemory(entity + offsets.m_clrRender, r, "int");
    mem.writeMemory(entity + offsets.m_clrRender + 0x1, g, "int");
    mem.writeMemory(entity + offsets.m_clrRender + 0x2, b, "int");
    mem.writeMemory(entity + offsets.m_clrRender + 0x3, a, "int");
}

module.exports.execute = async function(offsets) {
    var dwLocalPlayer = mem.readMemory(offsets.temp.dwClientDllBaseAddress + offsets.dwLocalPlayer, "int");
    var iLocalPlayerTeam = mem.readMemory(dwLocalPlayer + offsets.m_iTeamNum, "int");
    for (var i = 1; i < 65; i++){
        var dwEntity = mem.readMemory(offsets.temp.dwClientDllBaseAddress + offsets.dwEntityList + (i - 1) * offsets.m_EntLoopDist, "int");
        var iEntityTeam = mem.readMemory(dwEntity + offsets.m_iTeamNum, "int");
        
        if (iEntityTeam == iLocalPlayerTeam) {
            color.r = settings.chams.allay.r;
            color.g = settings.chams.allay.g;
            color.b = settings.chams.allay.b;
            color.a = settings.chams.allay.a;
        } else {
            color.r = settings.chams.enemy.r;
            color.g = settings.chams.enemy.g;
            color.b = settings.chams.enemy.b;
            color.a = settings.chams.enemy.a;
        }
        
        setRender(offsets, dwEntity, color.r, color.g, color.b, color.a);
    }
}

module.exports.settings = {
    delay: 1000,
    enabled: settings.chams.enabled
}