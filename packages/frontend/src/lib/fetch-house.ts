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

export const fetchHouse = async (
  tokenId: string
): Promise<HouseResponse> => {
  const params = new URLSearchParams({
    tokenId
  })
  const data = await fetchRealEstateData(params)
  return data
}

export const getCurrentPrice = (houseReponse: HouseResponse) => {
  const listPrice = houseReponse.listPrice ?? '0'
  return listPrice
}

