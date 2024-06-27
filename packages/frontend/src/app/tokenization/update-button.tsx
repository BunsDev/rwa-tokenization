import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  fetchHouse,
  fetchOnChainHouse,
  getCurrentPrice,
  getListPrice
} from '@/lib/fetch-house'

type OnchainResponseProps = {
  tokenId: string
}

export const UpdateButton = async ({
  tokenId,
}: OnchainResponseProps) => {
  const offchainData = await fetchHouse(tokenId)
  const onchainData = await fetchOnChainHouse(tokenId)

//   const rawData = JSON.stringify(houseData, null, 3)
  const listPrice = getListPrice(offchainData)
  const currentPrice = getCurrentPrice(onchainData)
  const needsUpdate = listPrice != currentPrice
//   console.log('needsUpdate: %s', needsUpdate)

  return (
    <>
      <Button
        disabled={!tokenId}
        // onClick={() => submit()}
        className={`${needsUpdate ? `h-[46px] w-full bg-[#375BD2] py-3 text-xl font-medium leading-[26px] hover:bg-[#375BD2]/90 mt-2` : `hidden`}`}
      >
        {/* <Image src="/refresh.svg" width={18} height={18} alt="arrow" className="mr-2" /> */}
        Update Contract
      </Button>
    </>
  )
      {/* <label className="text-base font-[450] text-card-foreground">
        Raw Data
      </label>
      <ScrollArea
        className={cn('mb-6 mt-2 h-[125px] rounded', firaCode.variable)}
      >
        <CodeBlock codeString={rawData} />
      </ScrollArea>
      <div className="flex justify-between space-x-4">
        <div className="flex flex-col justify-end">
          <label className="mb-2 text-base font-[450] text-card-foreground">
           Lasted Value
          </label>
          <div className="rounded bg-[#181D29] px-4 py-3 text-sm leading-4 text-muted-foreground">
            {parsedData}
          </div>
        </div>
        <div className="flex flex-col justify-end lg:grow">
          <label className="mb-2 text-base font-[450] text-card-foreground">
            Unit
          </label>
          <div className="rounded bg-[#181D29] px-4 py-3 text-sm leading-4 text-muted-foreground">
            {`$`}
          </div>
        </div>
      </div> */}
}
