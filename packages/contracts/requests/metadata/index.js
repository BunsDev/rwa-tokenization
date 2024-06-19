const id = args[0];
const infoResponse = await Functions.makeHttpRequest({
    url: `https://api.chateau.voyage/house/${id}`,
});
if (infoResponse.error) {
    throw Error('Housing Info Request Error');
}
const streetNumber = infoResponse.data.streetNumber;
const streetName = infoResponse.data.streetName;
const homeAddress = `${streetNumber} ${streetName}`;
const yearBuilt = infoResponse.data.yearBuilt;

return Functions.encodeString([streetNumber, streetName, yearBuilt]);;