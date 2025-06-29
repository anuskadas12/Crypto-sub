const { ethers } = require("hardhat")

async function main() {
  const [deployer] = await ethers.getSigners()
  const network = await ethers.provider.getNetwork()
  const hre = require("hardhat")

  console.log("Deploying contracts with the account:", deployer.address)
  console.log("Account balance:", (await deployer.getBalance()).toString())

  // Deploy SubscriptionManager contract
  const SubscriptionManager = await ethers.getContractFactory("SubscriptionManager")
  const feeRecipient = deployer.address // You can change this to a different address

  console.log("Deploying SubscriptionManager...")
  const subscriptionManager = await SubscriptionManager.deploy(feeRecipient)
  await subscriptionManager.deployed()

  console.log("SubscriptionManager deployed to:", subscriptionManager.address)
  console.log("Fee recipient set to:", feeRecipient)

  // Verify contract on Etherscan (optional)
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("Waiting for block confirmations...")
    await subscriptionManager.deployTransaction.wait(6)

    console.log("Verifying contract on Etherscan...")
    try {
      await hre.run("verify:verify", {
        address: subscriptionManager.address,
        constructorArguments: [feeRecipient],
      })
    } catch (error) {
      console.log("Verification failed:", error.message)
    }
  }

  // Save deployment info
  const deploymentInfo = {
    network: network.name,
    subscriptionManager: subscriptionManager.address,
    feeRecipient: feeRecipient,
    deployer: deployer.address,
    blockNumber: subscriptionManager.deployTransaction.blockNumber,
    transactionHash: subscriptionManager.deployTransaction.hash,
  }

  console.log("\nDeployment Summary:")
  console.log(JSON.stringify(deploymentInfo, null, 2))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
