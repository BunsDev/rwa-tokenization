import Image from 'next/image'
// import { formatDistanceToNow, fromUnixTime } from 'date-fns'
import { cn } from '@/lib/utils'
import { kv } from '@vercel/kv'
import { Suspense } from 'react'
import LoadingSpinner from '@/components/loading-spinner'
import { HouseHistoryEntry } from '@/types'
import { ScrollArea } from '@/components/ui/scroll-area'

// const getIcon = (code: number) => {
//   return (Object.keys(ICONS) as (keyof typeof ICONS)[]).find(
//     (key) => ICONS[key].includes(code),
//   )
// }

const History = async () => {
  const data = await kv.lrange<HouseHistoryEntry>('history', 0, -1)

  return (
    <div className="lg:w-[340px] lg:shrink-0 lg:border-l lg:border-l-border lg:pl-10">
      <h3 className="mb-9 text-2xl font-medium tracking-[-0.24px]">
        Recent Listings
      </h3>
      <Suspense
        fallback={
          <div className="flex h-[512px] flex-col items-center justify-center space-y-2 rounded bg-[#181D29]">
            <LoadingSpinner />
            <span className="text-sm font-[450] text-card-foreground">
              Data currently loading...
            </span>
          </div>
        }
      >
        <ScrollArea className="h-[512px]">
          <div className="space-y-4">
            {data.map(
              (
                {
                  id,
                  listPrice,
                  originalPrice,
                  taxValue,
                  homeAddress,
                  yearBuilt,
                  squareFootage,
                  txHash,
                },
                i,
              ) => (
                <a
                  key={txHash}
                  target="_blank"
                  rel="noreferrer"
                  href={
                    txHash ? `https://testnet.snowtrace.io/tx/${txHash}` : '#'
                  }
                  className={cn(
                    'flex items-center justify-between rounded-lg bg-[#181D29] p-6',
                    i === 3 && 'opacity-75',
                    i >= 4 && 'opacity-50',
                  )}
                >
                  <div className="flex flex-col space-y-2">
                    {/* <label className="font-[450] leading-4">{`${listPrice}`}</label> */}
                    {/* <span className="text-xs text-[#6D7380]">
                      {listPrice}
                    </span> */}
                  </div>
                  <div className="flex space-x-2">
                    <Image
                      src={`https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=1760&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`}
                      // src={`/${getIcon(Number(code))}.svg`}
                      alt={`generic house image`}
                      // alt={getIcon(Number(code)) ?? ''}
                      width={48}
                      height={48}
                    />
                    {/* <span className="text-2xl font-[450]">
                      {`
                      ${listPrice?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }${'$'}`}
                    </span> */}
                  </div>
                </a>
              ),
            )}
          </div>
        </ScrollArea>
      </Suspense>
    </div>
  )
}

export default History
