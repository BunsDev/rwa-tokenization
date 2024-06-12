// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { Test, console } from "forge-std/Test.sol";
import { RealEstateAsset } from "../src/RealEstateAsset.sol";
import { LinkToken } from "@chainlink/local/src/shared/LinkToken.sol";
import { FunctionsRouter } from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsRouter.sol";

contract RealEstateAssetTest is Test {
    RealEstateAsset public tokenizedRealEstate;

    address public alice;
    address public chainlinkAutomationForwarder;

    uint256 constant ARBITRUM_SEPOLIA_CHAIN_ID = 421614;
    uint72 constant JUELS_PER_LINK = 1e18;

    function setUp() public {
        alice = makeAddr("alice");
        LinkToken linkToken = new LinkToken();
        FunctionsRouter functionsRouter = new FunctionsRouter(address(linkToken), getRouterConfig());

        tokenizedRealEstate =
            new RealEstateAsset(address(functionsRouter), address(linkToken));

        console.log(block.chainid);
        vm.chainId(ARBITRUM_SEPOLIA_CHAIN_ID);
        console.log(block.chainid);
    }

    function test_Smoke() public {
        uint64 subscriptionId = 777;
        uint32 gasLimit = 300000;
        bytes32 donID = 0x66756e2d617262697472756d2d7365706f6c69612d3100000000000000000000; // fun-arbitrum-sepolia-1
        try tokenizedRealEstate.issue(alice, subscriptionId, gasLimit, donID) {}
        catch {
            // this call will fail due to missed setup for Functions, so we will mock fulfillment
        }
    }

    function getRouterConfig() public pure returns (FunctionsRouter.Config memory) {
        uint32[] memory maxCallbackGasLimits = new uint32[](3);
        maxCallbackGasLimits[0] = 300_000;
        maxCallbackGasLimits[1] = 500_000;
        maxCallbackGasLimits[2] = 1_000_000;

        return FunctionsRouter.Config({
            maxConsumersPerSubscription: 3,
            adminFee: 0, // Keep as 0. Setting this to anything else will cause fulfillments to fail with INVALID_COMMITMENT
            handleOracleFulfillmentSelector: 0x0ca76175,
            maxCallbackGasLimits: maxCallbackGasLimits,
            gasForCallExactCheck: 5000,
            subscriptionDepositMinimumRequests: 1,
            subscriptionDepositJuels: 11 * JUELS_PER_LINK
        });
    }
}