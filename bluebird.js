const mem = require("memoryjs");
const sks = require("asynckeystate");
const jsonfile = require("jsonfile");
const request = require("request");
const sleep = require("sleep");
const fs = require("fs");

var blueBird = {};

var offsets = {
    temp: {
        dwClientDllBaseAddress: null
    },
    dwLocalPlayer: 0xAA6614,
    dwEntityList: 0x4A8387C,
    dwForceJump: 0x4F1AAF4,
    dwGlowObjectManager: 0x4FA08E8,
    m_flFlashMaxAlpha: 0xA2F4,
    m_iGlowIndex: 0xA310,
    m_EntLoopDist: 0x10,
    m_bSpotted: 0x939,
    m_iTeamNum: 0xF0,
    m_bDormant: 0xE9,
    m_fFlags: 0x100
};

var processLoop = null;
var foundCSGO = false;

blueBird.getProcess = function() {
    mem.openProcess("csgo.exe", function(error, process) {
        if (error == "unable to find process") {
            return false;
        } else {
            try {
                var module = mem.findModule("client.dll", process.th32ProcessID);
                if (!foundCSGO) {
                    console.log("Found CS:GO!");
                    mem.findModule("client.dll", process.th32ProcessID, function(error, module) {
                        var module = module;
                        offsets.temp.dwClientDllBaseAddress = module.modBaseAddr;
                        foundCSGO = true;
                        blueBird.createThreads();
                    });
                }
            } catch (e) {
                if (foundCSGO) {
                    console.log("CS:GO closed!");
                    clearInterval(processLoop)
                    processLoop = setInterval(blueBird.getProcess, 1000);
                    foundCSGO = false;
                }
            }
        }
    });
};

blueBird.createThreads = function() {
    fs.readdir('./features/', (error, files) => {
        if(error) throw error;

        var files = files.filter(f => f.split('.').pop() === 'js');
        if(files.length <= 0)
            return console.log('No features to load!');

        console.log(`Loading ${files.length} features...`);
        files.forEach((f, i) => {
            var props = require(`./features/${f}`);
            console.log(`${i + 1}: ` + `${f} loaded!`);
            setInterval(function() {props.execute(offsets);}, props.settings.delay);
        });
    });
}

blueBird.update = function() {
    console.log("Waiting for CSGO...");
    processLoop = setInterval(blueBird.getProcess, 1000);
}

blueBird.update();