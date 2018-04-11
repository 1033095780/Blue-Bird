const mem = require("memoryjs");
const sks = require("asynckeystate");
const settings = require("../settings.json");

var color = {r: 0, g: 0, b: 0, a: 0};

function setGlow(offsets, index, r, g, b, a, bRenderWhenOccluded, bRenderWhenUnoccluded, bFullBloom) {
    var dwGlowObjectManager = mem.readMemory(offsets.temp.dwClientDllBaseAddress + offsets.dwGlowObjectManager, "int");
    mem.writeMemory(dwGlowObjectManager + (index * 0x38 + 0x4), (r / 255), "float");
    mem.writeMemory(dwGlowObjectManager + (index * 0x38 + 0x8), (g / 255), "float");
    mem.writeMemory(dwGlowObjectManager + (index * 0x38 + 0xC), (b / 255), "float");
    mem.writeMemory(dwGlowObjectManager + (index * 0x38 + 0x10), (a / 255), "float");
    mem.writeMemory(dwGlowObjectManager + (index * 0x38 + 0x24), bRenderWhenOccluded, "bool");
    mem.writeMemory(dwGlowObjectManager + (index * 0x38 + 0x25), bRenderWhenUnoccluded, "bool");
    mem.writeMemory(dwGlowObjectManager + (index * 0x38 + 0x26), bFullBloom, "bool");
}

module.exports.execute = async function(offsets) {
    var dwLocalPlayer = mem.readMemory(offsets.temp.dwClientDllBaseAddress + offsets.dwLocalPlayer, "int");
    var iLocalPlayerTeam = mem.readMemory(dwLocalPlayer + offsets.m_iTeamNum, "int");
    for (var i = 1; i < 65; i++){
        var dwEntity =  mem.readMemory(offsets.temp.dwClientDllBaseAddress + offsets.dwEntityList + (i - 1) * offsets.m_EntLoopDist, "int");
        var iEntityTeam = mem.readMemory(dwEntity + offsets.m_iTeamNum, "int");
        var bEntityDormant = mem.readMemory(dwEntity + offsets.m_bDormant, "int");
        
        if (!bEntityDormant) {
            var iGlowIndex = mem.readMemory(dwEntity + offsets.m_iGlowIndex, "int");
            
            if (iEntityTeam == iLocalPlayerTeam) {
                color.r = settings.glow.allay.r;
                color.g = settings.glow.allay.g;
                color.b = settings.glow.allay.b;
                color.a = settings.glow.allay.a;
            } else {
                color.r = settings.glow.enemy.r;
                color.g = settings.glow.enemy.g;
                color.b = settings.glow.enemy.b;
                color.a = settings.glow.enemy.a;
            }
            setGlow(offsets, iGlowIndex, color.r, color.g, color.b, color.a, true, false, settings.glow.bloom ? true : false)
        }
    }
}

module.exports.settings = {
    delay: 20,
    enabled: settings.glow.enabled
}