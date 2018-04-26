const mem = require("memoryjs");
const sks = require("asynckeystate");
const jsonfile = require("jsonfile");
const request = require("request");
const cc = require('colors/safe');
const sleep = require("sleep");
const fs = require("fs");

var blueBird = {};

var offsets = {
  temp: {
    dwClientDllBaseAddress: null,
    dwEngineDllBaseAddress: null
  },
  dwLocalPlayer: 0xAA6614,
  dwEntityList: 0x4A838FC,
  dwClientState: 0x57D894,
  dwForceAttack: 0x2EC5C4C,
  dwForceJump: 0x4F1AB74,
  dwFullUpdate: 0x174,
  dwGlowObjectManager: 0x4FA0950,
  dwClientState_ViewAngles: 0x4D10,
  m_iItemDefinitionIndex: 0x2F88,
  m_OriginalOwnerXuidLow: 0x3168,
  m_nFallbackPaintKit: 0x3170,
  m_nFallbackStatTrak: 0x317C,
  m_flFlashMaxAlpha: 0xA2F4,
  m_flFallbackWear: 0x3178,
  m_aimPunchAngle: 0x301C,
  m_hActiveWeapon: 0x2EE8,
  m_nFallbackSeed: 0x3174,
  m_szCustomName: 0x301C,
  m_dwViewAngles: 0x4D10,
  m_iCrosshairId: 0xB2A4,
  m_iItemIDHigh: 0x2FA0,
  m_iItemIDLow: 0x2FA4,
  m_iGlowIndex: 0xA310,
  m_hMyWeapons: 0x2DE8,
  m_EntLoopDist: 0x10,
  m_bSpotted: 0x939,
  m_clrRender: 0x70,
  m_iTeamNum: 0xF0,
  m_bDormant: 0xE9,
  m_iHealth: 0xFC,
  m_fFlags: 0x100
};

var processLoop = null;
var foundCSGO = false;

blueBird.getProcess = function () {
  mem.openProcess("csgo.exe", function (error, process) {
    if (error == "unable to find process") {
      return false;
    } else {
      try {
        var module = mem.findModule("client.dll", process.th32ProcessID);
        if (!foundCSGO) {
          console.log(cc.green("Found CS:GO!"));
          mem.findModule("engine.dll", process.th32ProcessID, function (error, module) {
            var module = module;
            offsets.temp.dwEngineDllBaseAddress = module.modBaseAddr;
            console.log(cc.green(`Found engine.dll at: ${offsets.temp.dwEngineDllBaseAddress}`));
          });
          mem.findModule("client.dll", process.th32ProcessID, function (error, module) {
            var module = module;
            offsets.temp.dwClientDllBaseAddress = module.modBaseAddr;
            console.log(cc.green(`Found client.dll at: ${offsets.temp.dwClientDllBaseAddress}`));
            foundCSGO = true;
            blueBird.createThreads();
          });
        }
      } catch (e) {
        if (foundCSGO) {
          console.log(cc.red("CS:GO closed!"));
          clearInterval(processLoop)
          processLoop = setInterval(blueBird.getProcess, 1000);
          foundCSGO = false;
        }
      }
    }
  });
};

blueBird.createThreads = function () {
  fs.readdir('./features/', (error, files) => {
    if (error) throw error;

    var files = files.filter(f => f.split('.').pop() === 'js');
    if (files.length <= 0)
      return console.log(cc.yellow('No features to load!'));

    console.log(cc.yellow(`Loading ${files.length} features...`));
    files.forEach((f, i) => {
      var props = require(`./features/${f}`);
      console.log(cc.green(`${i + 1}: ${f} loaded!`));
      props.settings.enabled ? console.log(cc.green("   > Enabled")) : console.log(cc.red("   > Disabled"));
      if (!props.settings.enabled) return;
      setInterval(function () { props.execute(offsets); }, props.settings.delay);
    });
  });
}

blueBird.update = function () {
  console.log(cc.yellow("Waiting for CSGO..."));
  processLoop = setInterval(blueBird.getProcess, 1000);
}

blueBird.update();