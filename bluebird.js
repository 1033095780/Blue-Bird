const mem = require("memoryjs");
const sks = require("asynckeystate");
const jsonfile = require("jsonfile");
const request = require("request");
const opener = require("opener");
const sleep = require("sleep");

var express = require("express"),
    app = express(),
    server = require("http").Server(app),
    io = require("socket.io")(server);

var blueBird = {};
var cheats = {};

var offsets = {
    temp: {
        dwClientDllBaseAddress: null
    },
    dwLocalPlayer: 0xAA6614,
    dwForceJump: 0x4F1AAF4,
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
                let module = mem.findModule("client.dll", process.th32ProcessID);
                if (!foundCSGO) {
                    console.log("Found CS:GO!");
                    mem.findModule("client.dll", process.th32ProcessID, function(error, module) {
                        let module = module;
                        offsets.temp.dwClientDllBaseAddress = module.modBaseAddr;
                        foundCSGO = true;
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

cheats.bhop = function() {
    let dwLocalPlayer = mem.readMemory(offsets.temp.dwClientDllBaseAddress + offsets.dwLocalPlayer, "int");
    let iFlags = mem.readMemory(dwLocalPlayer + offsets.m_fFlags, "int");
    if (sks.getAsyncKeyState(0x20)) {
        mem.writeMemory(offsets.temp.dwClientDllBaseAddress + offsets.dwForceJump, ((iFlags==257) || (iFlags==263)) ? 5 : 4, "int");
    }
}

blueBird.createThreads = function() {
    setInterval(cheats.bhop, 1);
}

blueBird.destroyThreads = function() {
    clearInterval(cheats.bhop)
}

blueBird.update = function() {
    console.log("Waiting for CSGO...");
    processLoop = setInterval(blueBird.getProcess, 1000);

    blueBird.createThreads();
}

blueBird.update();