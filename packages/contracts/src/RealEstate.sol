// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { ERC721URIStorage } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import { ERC721Burnable } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import { IERC20 } from "@openzeppelin/contracts/interfaces/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

import { LinkTokenInterface } from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";
import { FunctionsClient } from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import { FunctionsRequest } from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";
import { Base64 } from "@openzeppelin/contracts/utils/Base64.sol";
import { FunctionsSource } from "./FunctionsSource.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
*/

contract RealEstate is 
    ERC721, ERC721URIStorage, ERC721Burnable, 
    FunctionsClient, 
    ReentrancyGuard, Ownable(msg.sender) {
    using FunctionsRequest for FunctionsRequest.Request;
    using SafeERC20 for IERC20;

    FunctionsSource internal immutable i_functionsSource;
    LinkTokenInterface internal immutable i_linkToken;

    bytes32 internal s_lastRequestId;
    address internal s_automationForwarderAddress;

    mapping(bytes32 requestId => address to) internal s_issueTo;
    mapping(uint tokenId => PriceDetails) internal s_priceDetails;

    uint private _nextTokenId;

    enum PayFeesIn {
        Native,
        LINK
    }

    struct PriceDetails {
        uint80 listPrice;
        uint80 originalListPrice;
        uint80 taxAssessedValue;
    }

    // ERRORS //
    error NothingToWithdraw();
    error FailedToWithdrawEth(address owner, address target, uint value);
    error LatestIssueInProgress();
    error OnlyAutomationForwarderCanCall();

    modifier onlyAutomationForwarder() {
        if (msg.sender != s_automationForwarderAddress) {
            revert OnlyAutomationForwarderCanCall();
        }
        _;
    }

    constructor(
        address functionsRouterAddress,
        address linkTokenAddress
    ) ERC721("Tokenized Real Estate", "tRE") FunctionsClient(functionsRouterAddress) {
        i_functionsSource = new FunctionsSource();
        i_linkToken = LinkTokenInterface(linkTokenAddress);
    }

    /*/ RWA Tokenization Functionality /*/
    
    // assigns: requestId to a given recipient, which includes a request that pulls NFT metadata.
    function issue(address recipientAddress, uint64 subscriptionId, uint32 gasLimit, bytes32 donID)
        external
        onlyOwner
        returns (bytes32 requestId)
    {
        if (s_lastRequestId != bytes32(0)) revert LatestIssueInProgress();
        // generates: request (`req`)
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(i_functionsSource.getNftMetadata());
        // gets: requestId from the _sendRequest, which includes the encodeCBOR from the request (`req`).
        requestId = _sendRequest(req.encodeCBOR(), subscriptionId, gasLimit, donID);
        // maps: requestId --> recipient 
        s_issueTo[requestId] = recipientAddress;
    }

    // gets: price details for a given `tokenId`
    function getPriceDetails(uint tokenId) external view returns (PriceDetails memory) {
        return s_priceDetails[tokenId];
    }

    // upates: associated price details for a given `tokenId`.
    function updatePriceDetails(uint tokenId, uint64 subscriptionId, uint32 gasLimit, bytes32 donID)
        external
        onlyAutomationForwarder
        returns (bytes32 requestId)
    {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(i_functionsSource.getPrices());

        string[] memory args = new string[](1);
        args[0] = string(abi.encode(tokenId));

        requestId = _sendRequest(req.encodeCBOR(), subscriptionId, gasLimit, donID);
    }

    // sends: ETH balance stored in the contract (onlyOwner)
    function withdraw(address _beneficiary) public onlyOwner {
        uint amount = address(this).balance;

        if (amount == 0) revert NothingToWithdraw();

        (bool sent,) = _beneficiary.call{value: amount}("");

        if (!sent) revert FailedToWithdrawEth(msg.sender, _beneficiary, amount);
    }

    // sends: token balance stored in the contract (onlyOwner).
    function withdrawToken(address _beneficiary, address _token) public onlyOwner {
        uint amount = IERC20(_token).balanceOf(address(this));

        if (amount == 0) revert NothingToWithdraw();

        IERC20(_token).safeTransfer(_beneficiary, amount);
    }

    // FunctionsClient Functionality //

    // updates: `s_lastRequestId` and fulfills the request.
    function fulfillRequest(
        bytes32 requestId, 
        bytes memory response, 
        bytes memory /* err */
    ) internal override {
        // [if] asset is requested for the first time.
        if (s_lastRequestId == requestId) {
            // [then] decode: response to get property details.
            (string memory realEstateAddress, uint yearBuilt, uint lotSizeSquareFeet) =
                abi.decode(response, (string, uint, uint));
            
            // [then] increment: `tokenId`
            uint tokenId = _nextTokenId++;
            // [then] create URI: with property details.
            string memory uri = Base64.encode(
                bytes(
                    string(
                        abi.encodePacked(
                            '{"name": "Tokenized Real Estate",'
                            '"description": "Tokenized Real Estate",',
                            '"image": "",' '"attributes": [',
                            '{"trait_type": "realEstateAddress",',
                            '"value": ',
                            realEstateAddress,
                            "}",
                            ',{"trait_type": "yearBuilt",',
                            '"value": ',
                            yearBuilt,
                            "}",
                            ',{"trait_type": "lotSizeSquareFeet",',
                            '"value": ',
                            lotSizeSquareFeet,
                            "}",
                            "]}"
                        )
                    )
                )
            );
            // [then] create: finalTokenURI: with metadata.
            string memory finalTokenURI = string(abi.encodePacked("data:application/json;base64,", uri));
            // [then] mint: `tokenId` to the associated `issueTo` for a given `requestId`.
            _safeMint(s_issueTo[requestId], tokenId);
            // [then] set: tokenURI for a given `tokenId`, containing metadata.
            _setTokenURI(tokenId, finalTokenURI);

        // [else] update the price details for a given `tokenId`. 
        } else {
            (uint tokenId, uint listPrice, uint originalListPrice, uint taxAssessedValue) =
                abi.decode(response, (uint, uint, uint, uint));
            // map: price details to the associated `tokenId`.
            s_priceDetails[tokenId] = 
                PriceDetails({
                    listPrice: uint80(listPrice),
                    originalListPrice: uint80(originalListPrice),
                    taxAssessedValue: uint80(taxAssessedValue)
                });
        }
    }

    // sets: automation forwarder address (onlyOwner)
    function setAutomationForwarder(address automationForwarderAddress) external onlyOwner {
        s_automationForwarderAddress = automationForwarderAddress;
    }

    /*/ ERC721 Functionality /*/

    // gets: tokenURI for a given `tokenId`.
    function tokenURI(uint tokenId) public view override(ERC721, ERC721URIStorage) 
        returns (
            string memory
        ) {
        return super.tokenURI(tokenId);
    }
    
    // checks: interface is supported by this contract.
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (
        bool
    ) {
        return super.supportsInterface(interfaceId);
    }

}