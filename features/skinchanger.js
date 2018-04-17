const mem = require("memoryjs");
const sks = require("asynckeystate");
const settings = require("../settings.json");

function setSkin(offsets, iWeaponEntity, iSeed, fWear, iPaintKit, iStatTrak) {
    mem.writeMemory(iWeaponEntity + offsets.m_iItemIDLow, 0, "int");
    mem.writeMemory(iWeaponEntity + offsets.m_iItemIDHigh, -1, "int");
    mem.writeMemory(iWeaponEntity + offsets.m_nFallbackSeed, iSeed, "int");
    mem.writeMemory(iWeaponEntity + offsets.m_flFallbackWear, fWear, "float");
    mem.writeMemory(iWeaponEntity + offsets.m_nFallbackPaintKit, iPaintKit, "int");
    mem.writeMemory(iWeaponEntity + offsets.m_nFallbackStatTrak, iStatTrak, "int");
}

module.exports.execute = function (offsets) {
    var dwLocalPlayer = mem.readMemory(offsets.temp.dwClientDllBaseAddress + offsets.dwLocalPlayer, "int");
    for (i = 0; i != 65; i++) {
        iWeaponIndex = mem.readMemory(dwLocalPlayer + offsets.m_hMyWeapons + ((i - 1) * 0x4), "int") & 0xFFF;
        iWeaponEntity = mem.readMemory(offsets.temp.dwClientDllBaseAddress + offsets.dwEntityList + (iWeaponIndex - 1) * 0x10, "int");
        iWeaponID = mem.readMemory(iWeaponEntity + offsets.m_iItemDefinitionIndex, "int");
        iPaintKit = mem.readMemory(iWeaponEntity + offsets.m_nFallbackPaintKit, "int");
        iXuid = mem.readMemory(iWeaponEntity + offsets.m_OriginalOwnerXuidLow, "int");
        if (iWeaponID <= 0)
            continue;

        var keys = Object.keys(settings.skinchanger.skins);
        for (var a = 0, length = keys.length; a < length; a++) {
            var value = settings.skinchanger.skins[keys[a]];
            if (iWeaponID == value.id && iPaintKit != value.paintkit) {
                setSkin(offsets, iWeaponEntity, value.seed, value.wear, value.paintkit, value.stattrak)
            }
        }
    }
}

module.exports.settings = {
    delay: 5,
    enabled: settings.skinchanger.enabled
}