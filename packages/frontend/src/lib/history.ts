import { HouseHistoryEntry, WeatherHistoryEntry } from '@/types'
import { kv } from '@vercel/kv'
import {
  fetchCurrentWeather,
  getCurrentTemperature,
  getCurrentTemperatureUnit,
  getCurrentWeatherCode,
} from './fetch-weather'
import { getUnixTime } from 'date-fns'
import { fetchHouse, getCurrentPrice, getSquareFootage, getStreetName, getStreetNumber, getYearBuilt } from './fetch-house'

const DEFAULT_PROFILE_IMAGE =
  'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png'

export const addToWeatherHistory = async ({
  txHash,
  latitude,
  longitude,
  city,
  country,
}: {
  txHash: string
  latitude: number
  longitude: number
  city: string
  country: string
}) => {
  const currentEntries = await kv.lrange<WeatherHistoryEntry>('history', 0, -1)
  if (currentEntries.some((e) => e.txHash === txHash)) {
    throw new Error()
  }
  if (currentEntries.length >= 10) {
    await kv.rpop('history', 1)
  }
  const weatherResponse = await fetchCurrentWeather({
    latitude,
    longitude,
  })
  const timestamp = getUnixTime(Date.now())
  const weatherCode = getCurrentWeatherCode(weatherResponse)
  const temperature = getCurrentTemperature(weatherResponse)
  const temperatureUnit = getCurrentTemperatureUnit(weatherResponse)
  const historyEntry = {
    txHash: txHash,
    temperature: `${temperature}`,
    timestamp,
    city,
    country,
    weatherCode,
    temperatureUnit,
  }
  await kv.lpush<WeatherHistoryEntry>('history', historyEntry)
}

export const addToHouseHistory = async ({
  txHash,
  requestId,
  tokenId,
}: {
  txHash: string
  requestId: string
  tokenId: string
}) => {
  const currentEntries = await kv.lrange<HouseHistoryEntry>('history', 0, -1)
  if (currentEntries.some((e) => e.txHash === txHash)) {
    throw new Error()
  }
  if (currentEntries.length >= 10) {
    await kv.rpop('history', 1)
  }

  const data = await fetchHouse(tokenId)

  const id = data.id ?? '0'
  // const profileImageUrl = DEFAULT_PROFILE_IMAGE
  const listPrice = getCurrentPrice(data)
  const streetNumber = getStreetNumber(data)
  const streetName = getStreetName(data)
  const yearBuilt = getYearBuilt(data)
  const squareFootage = getSquareFootage(data)
  // const media = data.media ?? []
  const houseEntry: HouseHistoryEntry = {
    txHash,
    id,
    listPrice,
    streetName,
    streetNumber,
    yearBuilt,
    squareFootage,
  }

  await kv.lpush<HouseHistoryEntry>('history', houseEntry)
}

