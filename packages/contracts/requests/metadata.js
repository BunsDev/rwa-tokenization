const { ethers } = await import('npm:ethers@6.10.0');

const abiCoder = ethers.AbiCoder.defaultAbiCoder();

const apiResponse = await Functions.makeHttpRequest({
    url: `https://api.chateau.voyage/house/${tokenId}`,
})

const realEstateAddress = apiResponse.data.UnparsedAddress;
const yearBuilt = Number(apiResponse.data.YearBuilt);
const lotSizeSquareFeet = Number(apiResponse.data.LotSizeSquareFeet);
// const bedrooms = Number(apiResponse.data.BedroomsTotal);

console.log(`Real Estate Address: ${realEstateAddress}`);
console.log(`Year Built: ${yearBuilt}`);
console.log(`Lot Size Square Feet: ${lotSizeSquareFeet}`);
// console.log(`Bedrooms: ${bedrooms}`);

const encoded = abiCoder.encode([
    `string`, 
    `uint256`, 
    `uint256`
        // ,`uint256`
], [
    realEstateAddress, 
    yearBuilt, 
    lotSizeSquareFeet
    //  ,bedrooms
]
);

return ethers.getBytes(encoded);