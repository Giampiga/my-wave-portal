const main = async () => {
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    const waveContract = await waveContractFactory.deploy();
    await waveContract.deployed();
  
    console.log("Contract Addy:", waveContract.address);
  
    let waveCount;
    waveCount = await waveContract.getTotalWaves();
    console.log(waveCount.toNumber());
  
    let waveTxn = await waveContract.wave("Hey, this is a message!");
    await waveTxn.wait(); // Waiting for tx to be mined.
    
    const [_, randomPerson] = await hre.ethers.getSigners();
    console.log(randomPerson);
    waveTxn = await waveContract.connect(randomPerson).wave("Yoooo!! This is message 2. Awesome.");
    console.log("THIS PASSED");
    await waveTxn.wait();

    let allWaves = await waveContract.getAllWaves();
    waveCount = await waveContract.getTotalWaves();
   // console.log("A total of ", waveCount);
    console.log(allWaves);
  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();