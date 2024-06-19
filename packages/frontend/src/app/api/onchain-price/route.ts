import { NextRequest, NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { kv } from '@vercel/kv'

import { getHouseOnChain, requestHouseOnChain } from '@/lib/request-onchain'
import { addToHouseHistory } from '@/lib/history'

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(3, '10 m'),
})

const RATELIMIT_IP_EXCEPTION_LIST =
  process.env.RATELIMIT_IP_EXCEPTION_LIST?.split(',') || []

export async function POST(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1'

  // Only rate limit if IP is not in allowlist
  if (RATELIMIT_IP_EXCEPTION_LIST.indexOf(ip) == -1) {
    const { success } = await ratelimit.limit(ip)
    if (!success)
      return NextResponse.json({ error: 'Too many requests. Try again later.' })
  }

  const params = await request.json()
  if (!params || !params.recipientAddress)
    return NextResponse.error()

  const result = await requestHouseOnChain({
    recipientAddress: params.recipientAddress,
  })
  if (!result || !result.requestId) return NextResponse.error()

  const data = {
    requestId: result.requestId,
    txHash: result.tx.hash,
  }
  try {
    await addToHouseHistory({
      txHash: data.txHash,
      requestId: data.requestId,
      tokenId: params.tokenId,
    })
  } catch (error) {
    console.log('Adding request to history failed.')
  }
  return NextResponse.json({ data })
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const requestId = searchParams.get('requestId') || ''
  if (!requestId) return NextResponse.error()

  const data = await getHouseOnChain(requestId)

  return NextResponse.json({ data })
}
