import 'server-only'
import { ethers } from 'ethers'
import { realEstateABI, weatherConsumerABI } from '@/config/contracts'
import { Coordinates } from '@/types'

/* WEATHER REQUEST */

const getWeatherContract = () => {
  const provider = new ethers.JsonRpcProvider(process.env.NETWORK_RPC_URL)
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider)
  const contract = new ethers.Contract(
    process.env.CONTRACT_ADDRESS_METEO as string,
    weatherConsumerABI,
    signer,
  )
  return contract
}

export const getWeatherOnchain = async (requestId: string) => {
  const contract = getWeatherContract()
  const result = await contract.requests(requestId)
  
  if (!result.temperature) return
  
  return {
    temperature: result.temperature,
    timestamp: result.timestamp.toString(),
    latitude: result.lat,
    longitude: result.long,
  }
}

export const requestWeatherOnchain = async (location: Coordinates) => {
  const contract = getWeatherContract()
  const tx = await contract.requestWeatherInfo(
    location.latitude.toString(),
    location.longitude.toString(),
  )
  const receipt = await tx.wait()
  const requestId = receipt?.logs[2].args[0] as string
  return { tx, requestId }
}

/* RWA REQUEST */
const getRealEstateContract = () => {
  const provider = new ethers.JsonRpcProvider(process.env.NETWORK_RPC_URL)
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider)
  const contract = new ethers.Contract(
    process.env.CONTRACT_ADDRESS_REAL_ESTATE as string,
    realEstateABI,
    signer,
  )
  return contract
}
export const getHouseOnChain = async (requestId: string) => {
  const contract = getRealEstateContract()
  const result = await contract.requests(requestId)

  if (!result.tokenId) return

  return {
    tokenId: result.tokenId,
    response: result.response.toString()
  }
}

export const requestHouseOnChain = async (userAddress: any) => {
  const contract = getRealEstateContract()
  const tx = await contract.issueHouse(
    userAddress
  )
  const receipt = await tx.wait()
  const requestId = receipt?.logs[2].args[0] as string
  return { tx, requestId }
}