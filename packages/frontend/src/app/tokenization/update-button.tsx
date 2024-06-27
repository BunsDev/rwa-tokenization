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

  const listPrice = getListPrice(onchainData)
  const currentPrice = getCurrentPrice(offchainData)
  const needsUpdate = listPrice != currentPrice

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
}
