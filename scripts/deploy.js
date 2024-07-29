async function main() {
  // Log the start of the deployment process
  console.log('Preparing deployment...\n')

  // Fetch the contract factories for the Token and Exchange contracts
  const Token = await ethers.getContractFactory("Token")
  const Exchange = await ethers.getContractFactory("Exchange")

  // Fetch the available accounts for deployment
  const accounts = await ethers.getSigners()
  console.log(`Accounts fetched:\n${accounts[0].address}\n${accounts[1].address}\n`)

  // Deploy the Token contract with initial parameters for TonyToken
  const _TTK = await Token.deploy('TonyToken', 'TTK', '1000000')
  await _TTK.deployed()
  console.log(`TTK deployed to: ${_TTK.address}`)

  // Deploy the Token contract with initial parameters for ElyseToken
  const _EEK = await Token.deploy('ElyseToken', 'EEK', '1000000')
  await _EEK.deployed()
  console.log(`EEK deployed to: ${_EEK.address}`)

  // Deploy the Token contract with initial parameters for IrisToken
  const _IRIS = await Token.deploy('IrisToken', 'IRIS', '1000000')
  await _IRIS.deployed()
  console.log(`IRIS deployed to: ${_IRIS.address}`)

  // Deploy the Exchange contract with the second account as the fee account and a 10% fee
  const exchange = await Exchange.deploy(accounts[1].address, 10)
  await exchange.deployed()
  console.log(`Exchange deployed to: ${exchange.address}`)
}

// Execute the main function and handle any errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
