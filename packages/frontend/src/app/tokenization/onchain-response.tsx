import CodeBlock from '@/components/code-block'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  fetchHouse,
  fetchOnChainHouse,
  getListPrice
} from '@/lib/fetch-house'
import { firaCode } from '@/lib/fonts'
import { cn } from '@/lib/utils'

type OnchainResponseProps = {
  tokenId: string
}

export const OnchainResponse = async ({
  tokenId,
}: OnchainResponseProps) => {
  const houseData = await fetchOnChainHouse(tokenId)

  const rawData = JSON.stringify(houseData, null, 3)
  const listPrice = getListPrice(houseData)
  const parsedData = `${listPrice}`

  return (
    <>
      <label className="text-base font-[450] text-card-foreground">
        Raw Data
      </label>
      <ScrollArea
        className={cn('mb-6 mt-2 h-[125px] rounded', firaCode.variable)}
      >
        <CodeBlock codeString={rawData} />
      </ScrollArea>
        <div className="grid grid-cols-2 justify-center">
          <label className="flex justify-center py-2 text-base font-[450] text-card-foreground">
           Stored Price
          </label>
          <div className="flex rounded bg-[#181D29] px-4 py-3 text-sm leading-4 text-muted-foreground justify-center">
            {Number(parsedData).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}
          </div>
        </div>
    </>
  )
}
