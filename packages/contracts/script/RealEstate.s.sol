// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0;

import "forge-std/Script.sol";
import "../src/RealEstate.sol";

contract RealEstateScript is Script {
    address public immutable ROUTER_ADDRESS = 0xA9d587a00A31A52Ed70D6026794a8FC5E2F5dCb0;

    function run() external {
        uint deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // REFER TO DOCS FOR UP-TO-DATE ADDRESSES
        // https://docs.chain.link/chainlink-functions/supported-networks
        
        RealEstate realEstate = new RealEstate(
            ROUTER_ADDRESS
        );

        // silences warning.
        realEstate;

        vm.stopBroadcast();
    }
}