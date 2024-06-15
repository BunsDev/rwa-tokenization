// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { RealEstate } from './RealEstate.sol';
import { IBrokerage } from './interfaces/IBrokerage.sol';
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
*/

// Brokerage firm that manages real estate houses.
contract Brokerage is IBrokerage, Ownable(msg.sender) {
    bytes32 public constant INIT_CODE_PAIR_HASH 
        = keccak256(abi.encodePacked(type(RealEstate).creationCode));

    uint private _totalHouses;
    address[] public houses;
    mapping(address => uint[]) public housesByOwner;

    // network-specific settings // todo: verify && update.
    bytes32 public DON_ID = bytes32(0x66756e2d6176616c616e6368652d66756a692d31000000000000000000000000);
    address public LINK_ADDRESS = address(0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846);
    address public FUNCTIONS_ROUTER_ADDRESS = address(0xA9d587a00A31A52Ed70D6026794a8FC5E2F5dCb0);
    uint32 public GAS_LIMIT = 300_000;

    // creates: Houses struct (strictly immutable variables).
    struct Houses {
        address houseAddress;
        address homeownerAddress;
    }

    // houses info
    Houses[] public houseInfo;

    event IssuedHouse(
        uint indexed id,
        address homeownerAddress
    );

    // shows: total houses available from brokerage firm.
    function totalHouses() public view override returns (uint) {
        return _totalHouses;
    }
    
    // issues: house to a given owner
    function issueHouse(
        address recipientAddress,
        uint64 subscriptionId
    ) public onlyOwner returns (address house, uint id){
        // creates: id reference.
        id = houses.length;

        // generates: creation code, salt, then assembles a create2Address for the new property.
        house = generateHouse(recipientAddress, id);

        // stores: house to the houses[] array.
        houses.push(house);

        // stores: house to a given owner.
        housesByOwner[msg.sender].push(id);

        // increments: the total number of houses.
        _totalHouses++;

        // appends and populates: a new Houses struct (instance).
        houseInfo.push(Houses({
            houseAddress: houses[id],
            homeownerAddress: recipientAddress
        }));

        // executes: house issuance via the generated contract.
        _issueHouse(
            id, 
            recipientAddress,
            subscriptionId,
            GAS_LIMIT,
            DON_ID
        );
    
        emit IssuedHouse(id, recipientAddress);
    }

    // issues: real estate property.
    function _issueHouse(
        uint id,
        address recipientAddress,
        uint64 subscriptionId,
        uint32 gasLimit,
        bytes32 donID
    ) internal {

        // gets: stored house info by id.
        Houses storage house = houseInfo[id];

        // gets: associated variables by id.
        address houseAddress = house.houseAddress;

        // issues: new RealEstate NFT based off of the inputs.
        RealEstate(houseAddress).issue(
            recipientAddress, 
            subscriptionId,
            gasLimit,
            donID
        );
    }

    //////////////////////////////
        /*/ VIEW FUNCTIONS /*/
    //////////////////////////////

    // [.√.] returns: generated house address.
    function generateHouse(address ownerAddress, uint id) public returns (address house) {
        // generates: creation code, salt, then assembles a create2Address for the new house.
        bytes memory bytecode = type(RealEstate).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(ownerAddress, id));
        assembly { house := create2(0, add(bytecode, 32), mload(bytecode), salt) }
    }
}