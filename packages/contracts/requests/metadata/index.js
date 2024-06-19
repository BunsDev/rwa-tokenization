const { ethers } = await import('npm:ethers@6.10.0');
const abiCoder = ethers.AbiCoder.defaultAbiCoder();

const tokenId = args[0];

const apiResponse = await Functions.makeHttpRequest({
    url: `https://api.chateau.voyage/house/${tokenId}`,
})

const homeAddress = apiResponse.data.homeAddress;
const yearBuilt = Number(apiResponse.data.yearBuilt);
const squareFootage = Number(apiResponse.data.squareFootage);
// const bedrooms = Number(apiResponse.data.BedroomsTotal);

console.log(`Real Estate Address: ${homeAddress}`);
console.log(`Year Built: ${yearBuilt}`);
console.log(`Lot Size Square Feet: ${squareFootage}`);
// console.log(`Bedrooms: ${bedrooms}`);

const encoded = abiCoder.encode([
    `uint256`, 
    `string`,
    `uint256`,
    `uint256`
    // ,`uint256`
], [
    tokenId, 
    homeAddress,
    yearBuilt,
    squareFootage
    //  ,bedrooms
]
);

return ethers.getBytes(encoded);