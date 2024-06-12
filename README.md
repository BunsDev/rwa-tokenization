# Real World Asset (RWA) Tokenization
> Asset tokenization using Chainlink Functions on Avalanche.

----

# Getting Started 

## [Requirements](./docs/REQUIREMENTS.md)

## Installation

1. Clone the repo, navigate to the directory, and install dependencies with `make`
```
git clone https://github.com/BunsDev/rwa-asset-tokenization
cd rwa-asset-tokenization
make
```
----

# Methodology

We can tokenize real world assets by combining any of the following traits:
- **Asset**
  - On or Off Chain Asset Represented 
  - Nomenclature: [`AOn`, `AOff`] 
    > Note: on-chain asset are no longer "real world".
- **Collateral**
  - On or Off-Chain Collateral 
  - Nomenclature: [`COn`, `COff`] 
- **Backing**
  - Direct-backing or Indirect (*synthetic*)
  - Nomenclature: [`DB`, `SB`]

<br/>
<p align="center">
<img src="./img/tokenized-assets.svg" width="700" alt="tokenized-assets">
</p>
<br/>


---

# Resources

- [Chainlink Blog: RWA Explained](https://blog.chain.link/real-world-assets-rwas-explained/)

- [Education Hub: Tokenized Real Estate](https://chain.link/education-hub/tokenized-real-estate)

- [Bridge Interactive Data](https://bridgedataoutput.com/docs/explorer/reso-web-api#oShowProperty)