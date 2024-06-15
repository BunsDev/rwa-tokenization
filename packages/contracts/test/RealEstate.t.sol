// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { console } from "forge-std/Test.sol";
import { RealEstate } from "../src/RealEstate.sol";
import { LinkToken } from "@chainlink/local/src/shared/LinkToken.sol";
import { FunctionsRouter } from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsRouter.sol";
import { FunctionsScript } from "../script/Functions.s.sol";
import { BaseTest } from "./BaseTest.t.sol";

contract RealEstateTest is BaseTest {
    RealEstate public sRealEstate;
    FunctionsScript public functionsScript;

    address public alice;
    address public chainlinkAutomationForwarder;

    uint public constant AVAX_FUJI_CHAIN_ID = 43113;

  event SubscriptionCreated(uint64 indexed subscriptionId, address owner);
  event SubscriptionFunded(uint64 indexed subscriptionId, uint oldBalance, uint newBalance);
//   event SubscriptionConsumerAdded(uint64 indexed subscriptionId, address consumer);
//   event SubscriptionConsumerRemoved(uint64 indexed subscriptionId, address consumer);
//   event SubscriptionCanceled(uint64 indexed subscriptionId, address fundsRecipient, uint fundsAmount);
//   event SubscriptionOwnerTransferRequested(uint64 indexed subscriptionId, address from, address to);
//   event SubscriptionOwnerTransferred(uint64 indexed subscriptionId, address from, address to);

    function setUp() public override {
        alice = makeAddr("alice");
        LinkToken linkToken = new LinkToken();
        FunctionsRouter functionsRouter = 
            new FunctionsRouter(
                address(linkToken), 
                getRouterConfig()
            );

        sRealEstate =
            new RealEstate(address(functionsRouter), address(linkToken));

        console.log(block.chainid);
        vm.chainId(AVAX_FUJI_CHAIN_ID);
        console.log(block.chainid);
    }

    // function test_Smoke() public {
    //     uint64 subscriptionId = 777;
    //     uint32 gasLimit = 300000;
    //     bytes32 donID = 0x66756e2d617262697472756d2d7365706f6c69612d3100000000000000000000; // fun-arbitrum-sepolia-1
    //     try sRealEstate.issue(alice, subscriptionId, gasLimit, donID) {}
    //     catch {
    //         // this call will fail due to missed setup for Functions, so we will mock fulfillment
    //     }
    // }

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

    // function test_issue() public {
    //     sRealEstate.issue(
    //         OWNER_ADDRESS,     // address recipientAddress, 
    //                         // uint64 subscriptionId, 
    //                         // uint32 gasLimit, 
    //                         // bytes32 donID
    //     );
    // }

    function createSubscription() public {
        vm.expectEmit(true, false, false, false);
        emit SubscriptionCreated(1, OWNER_ADDRESS);
        vm.broadcast(OWNER_ADDRESS);
        uint64 subscriptionId = functionsScript.createSubscriptionWithConsumer(STRANGER_ADDRESS);
        assertEq(subscriptionId, 1);
        console.log("[SUCCESS]: Created Subscription[%s] With Consumer.", subscriptionId);
    }
}