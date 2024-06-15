// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { console } from "forge-std/Test.sol";
import { BaseTest } from "./BaseTest.t.sol";
import { Brokerage } from "../src/Brokerage.sol";

contract BrokerageTest is BaseTest {
    Brokerage public brokerage;

    function setUp() public override {
        brokerage = new Brokerage();
    }

    function test_TotalHouses() public {
        uint totalHouses = brokerage.totalHouses();
        console.log("Total houses:", totalHouses);
        assertEq(totalHouses, 0);
    }
}