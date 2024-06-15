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
4.  Create: Real World Asset (RWA) Lending Protocol
    - Collateral: (Tokenized) Real Estate Asset.
    - Asset: USDC
5. Calculate: Real Estate Value
    - Uses a function that updates data.
        - Informs latest data.
    - Updates: valuation of the real estate asset.
6. Calculate: LTV Ratio
    - Amount (of the loan) / Valuation (step 5) * 100%
    - Initial Threshold: 60%
    - Luqation Factor: 75%
7. WIP... @BunsDev TODO