// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

contract FunctionsSource {
    string public getNftMetadata = "const { ethers } = await import('npm:ethers@6.10.0');"
        "const abiCoder = ethers.AbiCoder.defaultAbiCoder();" "const tokenId = args[0];" 
        "const apiResponse = await Functions.makeHttpRequest({"
        "url: `https://api.chateau.voyage/house/${tokenId}`,"
        "});" "const realEstateAddress = apiResponse.data.UnparsedAddress;"
        "const yearBuilt = Number(apiResponse.data.YearBuilt);"
        "const lotSizeSquareFeet = Number(apiResponse.data.LotSizeSquareFeet);"
        "const encoded = abiCoder.encode([`string`, `uint256`, `uint256`], [realEstateAddress, yearBuilt, lotSizeSquareFeet]);"
        "return ethers.getBytes(encoded);";

    string public getPrices = "const { ethers } = await import('npm:ethers@6.10.0');"
        "const abiCoder = ethers.AbiCoder.defaultAbiCoder();" "const tokenId = args[0];"
        "const apiResponse = await Functions.makeHttpRequest({"
        "url: `https://api.chateau.voyage/house/${tokenId}`,"
        "});" "const listPrice = Number(apiResponse.data.listPrice);"
        "const originalPrice = Number(apiResponse.data.originalPrice);"
        "const taxValue = Number(apiResponse.data.taxValue);"
        "const encoded = abiCoder.encode([`uint256`, `uint256`, `uint256`, `uint256`], [tokenId, listPrice, originalPrice, taxValue]);"
        "return ethers.getBytes(encoded);";
}