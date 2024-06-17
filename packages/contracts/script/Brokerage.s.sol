// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0;

import "forge-std/Script.sol";
import "../src/Brokerage.sol";

contract BrokerageScript is Script {

    function run() external {
        uint deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // REFER TO DOCS FOR UP-TO-DATE ADDRESSES
        // https://docs.chain.link/chainlink-functions/supported-networks
        
        Brokerage functionsConsumer = new Brokerage();

        // silences warning.
        functionsConsumer;

        vm.stopBroadcast();
    }
}