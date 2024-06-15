'use strict';

const {web3Factory} = require("../../utils/web3");
const { CHAIN_ID, BROKERAGE_ADDRESS } = require("../../constants");
const web3 = web3Factory(CHAIN_ID);

const BROKERAGE_ABI = require('../../abis/Brokerage.json');

// CONTRACTS //
const Brokerage = new web3.eth.Contract(BROKERAGE_ABI, BROKERAGE_ADDRESS)

async function getInfo() {
    const totalHomes = await Brokerage.metheods.totalHomes().call()
        return {
            "totalHomes": totalHomes,
        }
}

async function getHouseInfo(ctx) {
    const houseAddress = ctx.params.address
    // const houseInfo = await Brokerage.methods.getHouseInfo(houseAddress).call()

        return {
            "houseAddress": houseAddress,
        }
}

async function infos(ctx) {
    ctx.body = (await getInfo(ctx))
}

async function houseInfo(ctx) {
    ctx.body = (await getHouseInfo(ctx))
}

module.exports = { infos, houseInfo };