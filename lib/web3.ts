import { ethers } from "ethers"

export const SUBSCRIPTION_CONTRACT_ADDRESS = "0x..." // Replace with actual deployed address
export const USDC_ADDRESS = "0xA0b86a33E6441b8C4505E2c8C5E6e8b8C4505E2c8" // Mainnet USDC
export const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F" // Mainnet DAI

export const getProvider = () => {
  if (typeof window !== "undefined" && window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum)
  }
  return null
}

export const getSigner = () => {
  const provider = getProvider()
  return provider?.getSigner()
}

export const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const formatTokenAmount = (amount: string, decimals = 18) => {
  return ethers.utils.formatUnits(amount, decimals)
}

export const parseTokenAmount = (amount: string, decimals = 18) => {
  return ethers.utils.parseUnits(amount, decimals)
}
