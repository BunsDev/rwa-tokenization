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

export const getStreetNumber = (houseReponse: HouseResponse) => {
  const streetNumber = houseReponse.streetNumber ?? '0'
  return streetNumber
}

export const getStreetName = (houseReponse: HouseResponse) => {
  const streetName = houseReponse.streetName ?? '0'
  return streetName
}

export const getYearBuilt = (houseReponse: HouseResponse) => {
  const yearBuilt = houseReponse.yearBuilt ?? '0'
  return yearBuilt
}

export const getSquareFootage = (houseReponse: HouseResponse) => {
  const squareFootage = houseReponse.squareFootage ?? '0'
  return squareFootage
}

