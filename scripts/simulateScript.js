const { simulateScript } = require("@chainlink/functions-toolkit");
const requestConfig = require('../requests/config');

async function main() {
    const { responseBytesHexstring, capturedTerminalOutput, errorString } = await simulateScript(requestConfig);

    console.log(responseBytesHexstring);
    console.log(errorString)
    console.log(capturedTerminalOutput);

    console.log(761167 * 100001272);
}

// node scripts/Simulate.js
main();