const { simulateScript } = require("@chainlink/functions-toolkit");
const requestConfig = require('../configs/priceConfig');

async function main() {
    const { responseBytesHexstring, capturedTerminalOutput, errorString } 
        = await simulateScript(requestConfig);

    console.log(responseBytesHexstring);
    console.log(errorString)
    console.log(capturedTerminalOutput);

    console.log(761167 * 100001272);
}

// node scripts/simulateScript.js
main();