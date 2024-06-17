const { ethers } = await import('npm:ethers@6.10.0');
const abiCoder = ethers.AbiCoder.defaultAbiCoder();

const tokenId = args[0];

const apiResponse = await Functions.makeHttpRequest({
    // url: `https://api.bridgedataoutput.com/api/v2/OData/test/Property('P_5dba1fb94aa4055b9f29696f')?access_token=6baca547742c6f96a6ff71b138424f21`,
    url: `https://api.chateau.voyage/house/${tokenId}`,
});

const listPrice = Number(apiResponse.data.listPrice);
const originalPrice = Number(apiResponse.data.originalPrice);
const taxValue = Number(apiResponse.data.taxValue);

console.log(`List Price: ${listPrice}`);
console.log(`Original List Price: ${originalPrice}`);
console.log(`Tax Assessed Value: ${taxValue}`);

const encoded = abiCoder.encode([
    `uint256`, 
    `uint256`, 
    `uint256`, 
    `uint256`
], [
    tokenId, 
    listPrice, 
    originalPrice, 
    taxValue
]);

return ethers.getBytes(encoded);