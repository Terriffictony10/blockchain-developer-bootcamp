const config = require('../src/config.json')

// Function to convert token amounts
const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

// Function to introduce a delay
const wait = (seconds) => {
  const milliseconds = seconds * 1000
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function main() {
  // Fetch accounts from wallet - these are unlocked
  const accounts = await ethers.getSigners()

  // Fetch network details
  const { chainId } = await ethers.provider.getNetwork()
  console.log("Using chainId:", chainId)

  // Fetch deployed tokens using addresses from config
  const DApp = await ethers.getContractAt('Token', config[chainId].TonyToken.address)
  console.log(`Dapp Token fetched: ${DApp.address}\n`)

  const mETH = await ethers.getContractAt('Token', config[chainId].ElyseToken.address)
  console.log(`mETH Token fetched: ${mETH.address}\n`)

  const mDAI = await ethers.getContractAt('Token', config[chainId].IrisToken.address)
  console.log(`mDAI Token fetched: ${mDAI.address}\n`)

  // Fetch the deployed exchange using address from config
  const exchange = await ethers.getContractAt('Exchange', config[chainId].exchange.address)
  console.log(`Exchange fetched: ${exchange.address}\n`)

  // Give tokens to account[1]
  const sender = accounts[0]
  const receiver = accounts[1]
  let amount = tokens(10000)

  // User1 transfers 10,000 mETH to User2
  let transaction, result
  transaction = await mETH.connect(sender).transfer(receiver.address, amount)
  console.log(`Transferred ${amount} tokens from ${sender.address} to ${receiver.address}\n`)

  // Set up exchange users
  const user1 = accounts[0]
  const user2 = accounts[1]
  amount = tokens(10000)

  // User1 approves 10,000 DApp tokens to the exchange
  transaction = await DApp.connect(user1).approve(exchange.address, amount)
  await transaction.wait()
  console.log(`Approved ${amount} tokens from ${user1.address}`)

  // User1 deposits 10,000 DApp tokens to the exchange
  transaction = await exchange.connect(user1).depositToken(DApp.address, amount)
  await transaction.wait()
  console.log(`Deposited ${amount} Ether from ${user1.address}\n`)

  // User2 approves 10,000 mETH tokens to the exchange
  transaction = await mETH.connect(user2).approve(exchange.address, amount)
  await transaction.wait()
  console.log(`Approved ${amount} tokens from ${user2.address}`)

  // User2 deposits 10,000 mETH tokens to the exchange
  transaction = await exchange.connect(user2).depositToken(mETH.address, amount)
  await transaction.wait()
  console.log(`Deposited ${amount} tokens from ${user2.address}\n`)

  /////////////////////////////////////////////////////////////
  // Seed a Cancelled Order
  //

  // User1 makes an order to get 100 mETH for 5 DApp tokens
  let orderId
  transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(100), DApp.address, tokens(5))
  result = await transaction.wait()
  console.log(`Made order from ${user1.address}`)

  // User1 cancels the order
  orderId = result.events[0].args.id
  transaction = await exchange.connect(user1).cancelOrder(orderId)
  result = await transaction.wait()
  console.log(`Cancelled order from ${user1.address}\n`)

  // Wait 1 second
  await wait(1)

  /////////////////////////////////////////////////////////////
  // Seed Filled Orders
  //

  // User1 makes an order to get 100 mETH for 10 DApp tokens
  transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(100), DApp.address, tokens(10))
  result = await transaction.wait()
  console.log(`Made order from ${user1.address}`)

  // User2 fills the order
  orderId = result.events[0].args.id
  transaction = await exchange.connect(user2).fillOrder(orderId)
  result = await transaction.wait()
  console.log(`Filled order from ${user1.address}\n`)

  // Wait 1 second
  await wait(1)

  // User1 makes another order to get 50 mETH for 15 DApp tokens
  transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(50), DApp.address, tokens(15))
  result = await transaction.wait()
  console.log(`Made order from ${user1.address}`)

  // User2 fills the order
  orderId = result.events[0].args.id
  transaction = await exchange.connect(user2).fillOrder(orderId)
  result = await transaction.wait()
  console.log(`Filled order from ${user1.address}\n`)

  // Wait 1 second
  await wait(1)

  // User1 makes a final order to get 200 mETH for 20 DApp tokens
  transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(200), DApp.address, tokens(20))
  result = await transaction.wait()
  console.log(`Made order from ${user1.address}`)

  // User2 fills the final order
  orderId = result.events[0].args.id
  transaction = await exchange.connect(user2).fillOrder(orderId)
  result = await transaction.wait()
  console.log(`Filled order from ${user1.address}\n`)

  // Wait 1 second
  await wait(1)

  /////////////////////////////////////////////////////////////
  // Seed Open Orders
  //

  // User1 makes 10 orders to get 10*i mETH for 10 DApp tokens
  for(let i = 1; i <= 10; i++) {
    transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(10 * i), DApp.address, tokens(10))
    result = await transaction.wait()

    console.log(`Made order from ${user1.address}`)

    // Wait 1 second
    await wait(1)
  }

  // User2 makes 10 orders to get 10 DApp for 10*i mETH
  for (let i = 1; i <= 10; i++) {
    transaction = await exchange.connect(user2).makeOrder(DApp.address, tokens(10), mETH.address, tokens(10 * i))
    result = await transaction.wait()

    console.log(`Made order from ${user2.address}`)

    // Wait 1 second
    await wait(1)
  }

}

// Execute the main function and handle any errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
