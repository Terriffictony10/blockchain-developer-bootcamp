async function main() {
  console.log('Preparing deployment...\n')
  // Fetch contract for deployment
  const Token = await ethers.getContractFactory("Token")
  const Exchange = await ethers.getContractFactory("Exchange")
  //Deploy contract
  const accounts = await ethers.getSigners()
  console.log(`Accounts fetched:\n${accounts[0].address}\n${accounts[1].address}\n`)

  const _TTK = await Token.deploy('TonyToken', 'TTK', '1000000')
  await _TTK.deployed()
  console.log(`TTK deployed to: ${_TTK.address}`)

  const _EEK = await Token.deploy('ElyseToken', 'EEK', '1000000')
  await _EEK.deployed()
  console.log(`EEK deployed to: ${_EEK.address}`)

  const _IRIS = await Token.deploy('IrisToken', 'IRIS', '1000000')
  await _IRIS.deployed()
  console.log(`IRIS deployed to: ${_IRIS.address}`)

  const exchange = await Exchange.deploy(accounts[1].address, 10)
  await exchange.deployed()

  console.log(`Exchange deployed to: ${exchange.address}`)

}


main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});
