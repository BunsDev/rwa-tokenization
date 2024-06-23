# RWA for Real Estate

**Objective One**: design a means to tokenize ownership of real estate property.
    - Include an issuance mechanism that enables someone to issue a tokenized representation of authentic ownership of a real world asset.
    - Assume some form of external authentication of ownership has taken place (off-chain).
    - Issue dynamic NFT asset that stores details regarding the property.

**Objective Two (optional)**: Real World Asset (RWA) Lending Protocol
    - Loans USDC to providers of tRE NFT (as collateral).

## Process

1.  Create: dNFT (ERC721)
2.  Connect dNFT to real world data.
    - @ issuance: stores metadata
    - uses: Zillow API
    - updates: metadata regularly
3.  Issuance: doesn't cover verification of authentic ownership [outside scope] -- assumes.