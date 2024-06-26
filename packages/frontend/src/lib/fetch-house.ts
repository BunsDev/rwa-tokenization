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

const fetchRealEstateOnchainData = cache(async (tokenId: string) => {
  const response = await fetch(`
    https://api.chateau.voyage/house/${tokenId}`)
  if (response.status !== 200) {
    throw new Error(`Status ${response.status}`)
  }
  return response.json()
})

// export const fetchHouse = async (
//   tokenId: string
// ): Promise<HouseResponse> => {
//   const data = await fetchRealEstateData(tokenId)
//   return data
// }

export const fetchHouse = async (
  tokenId: string
): Promise<HouseResponse> => {
  const data = await fetchRealEstateData(tokenId)
  return JSON.parse(`{
    "id": "${data.id}", 
    "homeAddress": "${data.homeAddress}",
    "listPrice": "${data.listPrice}"
  }`)
}

export const fetchOnChainHouse = async (
  tokenId: string
): Promise<HouseResponse> => {
  const onchainData = await fetchRealEstateOnchainData(tokenId)
  return JSON.parse(`{
    "id": "${onchainData.id}", 
    "homeAddress": "${onchainData.homeAddress}",
    "latestValue": "${onchainData.latestValue}"
  }`)
}

export const getTokenId = (houseReponse: HouseResponse) => {
  const tokenId = houseReponse?.tokenId ?? '0'
  return tokenId
}

export const getListPrice = (houseReponse: HouseResponse) => {
  const listPrice = houseReponse.listPrice ?? '0'
  return listPrice
}

export const getCurrentPrice = (houseReponse: HouseResponse) => {
  const latestValue = houseReponse.latestValue ?? '0'
  return latestValue
}

export const getlatestValue = (houseReponse: HouseResponse) => {
  const latestValue = houseReponse.latestValue ?? '0'
  return latestValue
}

export const getHomeAddress = (houseReponse: HouseResponse) => {
  const homeAddress = houseReponse.homeAddress ?? ''
  return homeAddress
}

export const getSquareFootage = (houseReponse: HouseResponse) => {
  const squareFootage = houseReponse.squareFootage ?? '0'
  return squareFootage
}

function convertStringToJson(text: string) {
    try {
        const jsonObject = JSON.parse(text);
        return jsonObject;
    } catch (error) {
        console.error('Error parsing JSON:', error);
        return null; // or handle the error as needed
    }
}

// Example usage:
// const jsonString = '{"name": "John", "age": 30, "city": "New York"}';
// const jsonObject = convertStringToJson(jsonString);

// if (jsonObject !== null) {
//     console.log('Parsed JSON object:', jsonObject);
// } else {
//     console.log('Failed to parse JSON.');
// }
