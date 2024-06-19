// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0;

import "forge-std/Script.sol";
import "../src/RealEstate.sol";

contract RealEstateScript is Script {
    // network-specific settings (todo verify target network configurations).
    bytes32 public immutable DON_ID = bytes32(0x66756e2d6176616c616e6368652d66756a692d31000000000000000000000000);
    // address public immutable LINK_ADDRESS = address(0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846);
    address public immutable FUNCTIONS_ROUTER_ADDRESS = address(0xA9d587a00A31A52Ed70D6026794a8FC5E2F5dCb0);
    uint32 public immutable GAS_LIMIT = 300_000;
    uint64 public immutable SUBSCRIPTION_ID = 9614;

    function run() external {
        uint deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // REFER TO DOCS FOR UP-TO-DATE ADDRESSES
        // https://docs.chain.link/chainlink-functions/supported-networks
        
        RealEstate realEstate = new RealEstate(
            FUNCTIONS_ROUTER_ADDRESS,
            DON_ID,
            SUBSCRIPTION_ID,
            GAS_LIMIT
        );

        // silences warning.
        realEstate;

        vm.stopBroadcast();
    }
}