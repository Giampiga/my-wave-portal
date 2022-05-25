// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "hardhat/console.sol"; 

contract WavePortal {
    uint256 totalWaves; // Automatically initialized to 0

    event newWave(address indexed from, uint256 timestamp, string message);

    // Wave struct, stores the address of person who waved, alongside a message and the timestamp the wave occurred.
    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }

    Wave[] Waves; // Storing all of our waves in an array

    constructor() { 
        console.log("Yo yo! I am a contract, and I am smart"); 
    }

    // Increments totalWaves by 1, and consolelogs who waved. This new wave gets appended to our array
    // and newWave event gets executed.
    function wave(string memory _message) public {
        totalWaves += 1;
        console.log("%s has waved! They left a message saying: ", msg.sender, _message);
        Waves.push(Wave(msg.sender, _message, block.timestamp));

        emit newWave(msg.sender, block.timestamp, _message);
    }

    // Return our array of waves
    function getAllWaves() public view returns(Wave[] memory) {
        return Waves;
    }
    // Returns totalWaves
    function getTotalWaves() public view returns (uint256) {
        console.log("We have %s total of waves!", totalWaves);
        return totalWaves;
    }
}