const BN = require("bn.js")
const BROKERAGE_ABI = require('./abis/Brokerage.json');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3002'
const CHAIN_ID = 43113 // 0xa869

const RPC_URLS = [
  'https://api.avax-test.network/ext/bc/C/rpc', 
  'https://rpc.ankr.com/avalanche_fuji',
  'https://ava-testnet.public.blastapi.io/ext/bc/C/rpc'
]

const _1E18 = new BN("1000000000000000000");
const BROKERAGE_ADDRESS = "0x0cd2E31eb378110DDD62778E136ba664A624b1CA"

module.exports = {
  API_BASE_URL, RPC_URLS, CHAIN_ID, _1E18, BN,
  BROKERAGE_ADDRESS, BROKERAGE_ABI
};
