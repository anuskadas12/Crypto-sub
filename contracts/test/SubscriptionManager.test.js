const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("SubscriptionManager", () => {
  let subscriptionManager
  let mockUSDC
  let owner
  let creator
  let subscriber
  let feeRecipient

  beforeEach(async () => {
    ;[owner, creator, subscriber, feeRecipient] = await ethers.getSigners()

    // Deploy mock USDC token
    const MockERC20 = await ethers.getContractFactory("MockERC20")
    mockUSDC = await MockERC20.deploy("Mock USDC", "USDC", 6)
    await mockUSDC.deployed()

    // Deploy SubscriptionManager
    const SubscriptionManager = await ethers.getContractFactory("SubscriptionManager")
    subscriptionManager = await SubscriptionManager.deploy(feeRecipient.address)
    await subscriptionManager.deployed()

    // Mint USDC to subscriber
    await mockUSDC.mint(subscriber.address, ethers.utils.parseUnits("1000", 6))
  })

  describe("Plan Creation", () => {
    it("Should create a subscription plan", async () => {
      const planName = "Test Plan"
      const planDescription = "Test Description"
      const price = ethers.utils.parseUnits("10", 6) // 10 USDC
      const duration = 30 * 24 * 60 * 60 // 30 days
      const metadataURI = "https://example.com/metadata.json"

      await subscriptionManager
        .connect(creator)
        .createPlan(planName, planDescription, price, duration, mockUSDC.address, metadataURI)

      const plan = await subscriptionManager.getPlan(1)
      expect(plan.name).to.equal(planName)
      expect(plan.price).to.equal(price)
      expect(plan.creator).to.equal(creator.address)
      expect(plan.active).to.be.true
    })
  })

  describe("Subscriptions", () => {
    beforeEach(async () => {
      // Create a plan
      await subscriptionManager
        .connect(creator)
        .createPlan(
          "Test Plan",
          "Test Description",
          ethers.utils.parseUnits("10", 6),
          30 * 24 * 60 * 60,
          mockUSDC.address,
          "https://example.com/metadata.json",
        )

      // Approve USDC spending
      await mockUSDC.connect(subscriber).approve(subscriptionManager.address, ethers.utils.parseUnits("100", 6))
    })

    it("Should allow subscription to a plan", async () => {
      await subscriptionManager.connect(subscriber).subscribe(1)

      const subscription = await subscriptionManager.getSubscription(subscriber.address, 1)
      expect(subscription.active).to.be.true
      expect(subscription.subscriber).to.equal(subscriber.address)
      expect(subscription.planId).to.equal(1)
    })

    it("Should mint NFT on subscription", async () => {
      await subscriptionManager.connect(subscriber).subscribe(1)

      const subscription = await subscriptionManager.getSubscription(subscriber.address, 1)
      const tokenId = subscription.tokenId

      expect(await subscriptionManager.ownerOf(tokenId)).to.equal(subscriber.address)
    })

    it("Should distribute payments correctly", async () => {
      const initialCreatorBalance = await mockUSDC.balanceOf(creator.address)
      const initialFeeRecipientBalance = await mockUSDC.balanceOf(feeRecipient.address)

      await subscriptionManager.connect(subscriber).subscribe(1)

      const finalCreatorBalance = await mockUSDC.balanceOf(creator.address)
      const finalFeeRecipientBalance = await mockUSDC.balanceOf(feeRecipient.address)

      const price = ethers.utils.parseUnits("10", 6)
      const feeAmount = price.mul(250).div(10000) // 2.5%
      const creatorAmount = price.sub(feeAmount)

      expect(finalCreatorBalance.sub(initialCreatorBalance)).to.equal(creatorAmount)
      expect(finalFeeRecipientBalance.sub(initialFeeRecipientBalance)).to.equal(feeAmount)
    })
  })

  describe("Subscription Management", () => {
    beforeEach(async () => {
      await subscriptionManager
        .connect(creator)
        .createPlan(
          "Test Plan",
          "Test Description",
          ethers.utils.parseUnits("10", 6),
          30 * 24 * 60 * 60,
          mockUSDC.address,
          "https://example.com/metadata.json",
        )

      await mockUSDC.connect(subscriber).approve(subscriptionManager.address, ethers.utils.parseUnits("100", 6))

      await subscriptionManager.connect(subscriber).subscribe(1)
    })

    it("Should allow subscription renewal", async () => {
      const subscriptionBefore = await subscriptionManager.getSubscription(subscriber.address, 1)

      await subscriptionManager.connect(subscriber).renewSubscription(1)

      const subscriptionAfter = await subscriptionManager.getSubscription(subscriber.address, 1)
      expect(subscriptionAfter.endTime).to.be.gt(subscriptionBefore.endTime)
    })

    it("Should allow subscription cancellation", async () => {
      const subscription = await subscriptionManager.getSubscription(subscriber.address, 1)
      const tokenId = subscription.tokenId

      await subscriptionManager.connect(subscriber).cancelSubscription(1)

      const updatedSubscription = await subscriptionManager.getSubscription(subscriber.address, 1)
      expect(updatedSubscription.active).to.be.false

      // NFT should be burned
      await expect(subscriptionManager.ownerOf(tokenId)).to.be.revertedWith("ERC721: invalid token ID")
    })
  })
})
