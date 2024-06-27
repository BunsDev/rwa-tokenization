import { NextRequest, NextResponse } from 'next/server'

import { getHouseOnChain, requestHouseOnChain } from '@/lib/request-onchain'
// import { addToHouseHistory } from '@/lib/history'

export async function POST(request: NextRequest) {
  const params = await request.json()
  if (!params || !params.tokenId) return NextResponse.error()

  const { tokenId } = params

  const { tx, requestId } = await requestHouseOnChain(tokenId, tokenId)

  if (!tx) return NextResponse.error()

  return NextResponse.json({ tx, requestId })
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const requestId = searchParams.get('requestId') || ''

  if (!requestId) return NextResponse.error()
  // @ts-ignore
  const [tokenId, response] = await getHouseOnChain(requestId)
  return NextResponse.json({ tokenId, response })
}