import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WavePortal.json';

const App = () => {
  const [allWaves, setAllWaves] = useState([]);
  const [currentAccount, setCurrentAccount] = useState("");
  const contractAddress = "0x270b2eF5540902BbbB5E2121dF11220055a4BFe6";
  const contractABI = abi.abi;
  let waveMsg = "hai2";
  let totalWaves;
  
  const checkIfWalletConnected = async () => {
    try {
      const { ethereum } = window;
  
      if (!ethereum) {
        console.log("Make sure you're logged in using MetaMask.");
      } else {
        console.log("We have the ethereum object.", ethereum);
        getAllWaves();
      }
  
      const accounts = await ethereum.request({ method: "eth_accounts" });
  
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("We have authorized account: ", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found.");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log(error);
    }
  }

  const wave = async () => {
    try {
      const ethereum = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Total wave count: ", count.toNumber());
        waveMsg = document.getElementById("waveMsg").value;
        const waveTxn = await wavePortalContract.wave(waveMsg);
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined --", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        totalWaves = count;
        console.log("Total waves: ", totalWaves.toNumber());
        document.getElementById("waveCount").innerHTML = totalWaves;
      } else {
        console.log("Ethereum object does not exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getAllWaves = async () => {
    try {
      const {ethereum} = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        const waves = await wavePortalContract.getAllWaves();
        console.log(waves)
        let wavesCleaned = [];
        
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        setAllWaves(wavesCleaned);
      } else {
        console.log("ETH object does NOT exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    checkIfWalletConnected();
  }, [])
  
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        👋 hey there!
        </div>
        
        <div className="bio">
        hi i am giampiero, from venezuela🇻🇪<br></br> 
        i am a compsci major about to graduate from university of central florida. <br></br>
          music & web 3 enthusiast :)<br></br>
          <a href="https://www.linkedin.com/in/giampiga">linked in</a>
        </div>

          <input type="text" name="waveMsg" id="waveMsg"></input>
          <button className="waveButton" onClick={wave}>
            👋 wave at me! 😊
          </button>

        {!currentAccount && (
      <button className="waveButton" onClick={connectWallet}>
        connect using metamask
      </button>
        )}
        {currentAccount && (
        <div className="bio">total waves: <span id="waveCount"> waves </span></div>
      )}
        
        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}
        
      <div className="bio">this is my first web3 app thanks to <a href="https://buildspace.so">buildspace🦄</a>
        <br></br>deployed on rinkeby testnet, will deploy to mainnet soon</div>
      </div>
    </div>
  );
}

export default App