import 'server-only'
import { cache } from 'react'
import { HouseResponse } from '@/types'

const apiUrl = 'https://api.chateau.voyage'

const fetchRealEstateData = cache(async (params: URLSearchParams) => {
  const response = await fetch(`${apiUrl}/house/${params.toString()}`,
    {
      headers: {},
      cache: 'force-cache',
    })
  if (response.status !== 200) {
    throw new Error(`Status ${response.status}`)
  }
  return response.json()
})

// const fetchRealEstateData = cache(async (params: URLSearchParams) => {
//   const response = await fetch(`${apiUrl}/house/${params.toString()}`,
//     {
//       headers: {},
//       cache: 'force-cache',
//     })
//   if (response.status !== 200) {
//     throw new Error(`Status ${response.status}`)
//   }
//   return response.json()
// })


export const fetchHouse = async (
  tokenId: string
): Promise<HouseResponse> => {
  const params = new URLSearchParams({
    tokenId: tokenId
  })
  const data = await fetchRealEstateData(params)
  return data
}

export const getTokenId = (houseReponse: HouseResponse) => {
  const tokenId = houseReponse.id ?? 0
  return tokenId
}

export const getCurrentPrice = (houseReponse: HouseResponse) => {
  const listPrice = houseReponse.listPrice ?? 0
  return listPrice
}

export const getStreetNumber = (houseReponse: HouseResponse) => {
  const streetNumber = houseReponse.streetNumber ?? 0
  return streetNumber
}

export const getStreetName = (houseReponse: HouseResponse) => {
  const streetName = houseReponse.streetName ?? '0'
  return streetName
}

export const getYearBuilt = (houseReponse: HouseResponse) => {
  const yearBuilt = houseReponse.yearBuilt ?? 0
  return yearBuilt
}

export const getSquareFootage = (houseReponse: HouseResponse) => {
  const squareFootage = houseReponse.squareFootage ?? 0
  return squareFootage
}

