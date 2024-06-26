export type Coordinates = {
  latitude: number
  longitude: number
}

export type GeoLocation = {
  city: string
  state: string
  countryCode: string
  coordinates: Coordinates
}

export type WeatherResponse = {
  timezone: string
  current: {
    temperature_2m: number
    time: string
    interval: string
    weather_code: string
  }
  current_units: {
    temperature_2m: string
    time: string
    interval: string
    weather_code: string
  }
} & Coordinates

export type WeatherHistoryEntry = {
  txHash: string
  temperature: string
  timestamp: number
  temperatureUnit: string
  weatherCode: string
  city: string
  country: string
}

export type HouseHistoryEntry = {
  txHash: string
  tokenId: string
  listPrice: string
  homeAddress: string
  squareFootage: string
}

export type HouseResponse = {
  tokenId: string
  listPrice: string
  homeAddress: string
  squareFootage: string
}

export type UserData = {
  id: string
  username: string
  name: string
  profile_image_url: string
}

export type UserError = {
  value: string
  detail: string
  title: string
  resource_type: string
  parameter: string
  resource_id: string
  type: string
}

export type DataResponse = {
  errors?: UserError[]
  user?: UserData
  media?: string[]
}

export type UserDataResponse = {
  data?: UserData
  errors?: UserError[]
}

export type MediaData = {
  media_key: string
  type: 'animated_gif' | 'photo' | 'video'
  url?: string
  preview_image_url?: string
}
