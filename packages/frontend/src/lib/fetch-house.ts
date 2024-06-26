import 'server-only'
import { cache } from 'react'
import { HouseResponse } from '@/types'

const fetchRealEstateData = cache(async (tokenId: string) => {
  const response = await fetch(`
    https://api.chateau.voyage/house/${tokenId}`)
  if (response.status !== 200) {
    throw new Error(`Status ${response.status}`)
  }
  return response.json()
})

export const fetchHouse = async (
  tokenId: string
): Promise<HouseResponse> => {
  const data = await fetchRealEstateData(tokenId)
  return data
}

export const getTokenId = (houseReponse: HouseResponse) => {
  const tokenId = houseReponse?.tokenId ?? '0'
  return tokenId
}

export const getCurrentPrice = (houseReponse: HouseResponse) => {
  const listPrice = houseReponse.listPrice ?? '0'
  return listPrice
}

export const getHomeAddress = (houseReponse: HouseResponse) => {
  const homeAddress = houseReponse.homeAddress ?? ''
  return homeAddress
}

export const getSquareFootage = (houseReponse: HouseResponse) => {
  const squareFootage = houseReponse.squareFootage ?? '0'
  return squareFootage
}

