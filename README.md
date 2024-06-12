# Real World Asset (RWA) Tokenization
> Asset tokenization using Chainlink Functions on Avalanche.

----

# Getting Started 

## Requirements

- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
  - You'll know you did it right if you can run `git --version` and you see a response like `git version x.x.x`
- [foundry](https://getfoundry.sh/)
  - You'll know you did it right if you can run `forge --version` and you see a response like `forge 0.2.0 (816e00b 2023-03-16T00:05:26.396218Z)`
- [node](https://nodejs.org/en/download/)
  - You'll know you did it right if you can run `node --version` and you see a response like `v16.13.0`  
- [npm](https://www.npmjs.com/get-npm)
  - You'll know you did it right if you can run `npm --version` and you see a response like `8.1.0`
- [deno](https://docs.deno.com/runtime/manual/getting_started/installation)
  - You'll know you did it right if you can run `deno --version` and you see a response like `deno 1.40.5 (release, x86_64-apple-darwin) v8 12.1.285.27 typescript 5.3.3`

## Installation

Clone the repo, navigate to the directory, and install dependencies with `make`
```
git clone https://github.com/BunsDev/rwa-asset-tokenization
cd rwa-asset-tokenization
make
```

## Simulations

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