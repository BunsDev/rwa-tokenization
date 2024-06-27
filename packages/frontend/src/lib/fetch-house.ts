import 'server-only'
import { cache } from 'react'
import { HouseResponse } from '@/types'

const API_URL = `https://api.chateau.voyage/house`

const fetchRealEstateData = cache(
  async <T>(
    // slug: string,
    tokenId: string, // URLSearchParams,
    revalidate = 60,
  ): Promise<T> => {
    const response = await fetch(
      `${API_URL}/${tokenId.toString()}`,
      {
        headers: {
        },
        next: {
          revalidate,
        },
      },
    )
    if (response.status !== 200) {
      console.log(response)
      throw new Error(`Status ${response.status}`)
    }
    return response.json()
  },
)

export const fetchHouse = async (tokenId: string) => {
  const data = await fetchRealEstateData<HouseResponse>(
    tokenId
  )
  return JSON.parse(`{
    "id": "${data.id}", 
    "listPrice": "${data?.listPrice}"
  }`) as HouseResponse
}

export const fetchOnChainHouse = async (tokenId: string) => {
  const onchainData = await fetchRealEstateData<HouseResponse>(
    tokenId
  )
  return JSON.parse(`{
       "id": "${onchainData.id}", 
       "latestValue": "${onchainData?.latestValue}"
  }`) as HouseResponse
}

export const getTokenId = (houseReponse: HouseResponse) => {
  const tokenId = houseReponse?.id ?? '0'
  return tokenId
}

export const getListPrice = (houseReponse: HouseResponse) => {
  const listPrice = houseReponse?.listPrice ?? '0'
  return listPrice
}

export const getCurrentPrice = (houseReponse: HouseResponse) => {
  const latestValue = houseReponse?.latestValue ?? '0'
  return latestValue
}

export const getHomeAddress = (houseReponse: HouseResponse) => {
  const homeAddress = houseReponse?.homeAddress ?? ''
  return homeAddress
}

export const getSquareFootage = (houseReponse: HouseResponse) => {
  const squareFootage = houseReponse?.squareFootage ?? '0'
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
