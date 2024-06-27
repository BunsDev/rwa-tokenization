import 'server-only'
import { ethers } from 'ethers'
import { realEstateABI } from '@/config/contract'

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

export const requestHouseOnChain = async (tokenId: any) => {
  const contract = getRealEstateContract()
  const tx = await contract.requestLastPrice(
    tokenId
  )
  const receipt = await tx.wait()
  const requestId = receipt?.logs[2].args[0] as string
  return { tx, requestId }
}