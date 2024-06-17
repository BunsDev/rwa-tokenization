// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;

import { FunctionsClient } from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import { ConfirmedOwner } from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import { FunctionsRequest } from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";
import { FunctionsSource } from "./FunctionsSource.sol";
import { Base64 } from "@openzeppelin/contracts/utils/Base64.sol";

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { ERC721URIStorage } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import { ERC721Burnable } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

/**
 * @title Chainlink Functions example on-demand consumer contract example
 */
contract RealEstate is FunctionsClient, ConfirmedOwner,
    ERC721, ERC721URIStorage, ERC721Burnable
 {
    using FunctionsRequest for FunctionsRequest.Request;

    FunctionsSource internal immutable i_functionsSource;

    // DON ID for the Functions DON to which the requests are sent
    bytes32 public donId;

    // reports: latestPrice response.
    string public latestPrice;

    uint private _totalHouses;
    uint private _nextTokenId;

    // stored variables
    bytes32 public s_latestRequestId;
    bytes public s_latestResponse;
    bytes public s_latestError;
    address internal s_automationForwarderAddress;

    mapping(bytes32 requestId => address to) internal s_issueTo;
    mapping(uint tokenId => PriceDetails) internal s_priceDetails;

    error LatestIssueInProgress();
    error OnlyAutomationForwarderCanCall();

    struct PriceDetails {
        uint80 listPrice;
        uint80 originalPrice;
        uint80 taxValue;
    }

    modifier onlyAutomationForwarder() {
        if (msg.sender != s_automationForwarderAddress) {
            revert OnlyAutomationForwarderCanCall();
        }
        _;
    }

    // emits: price reported event.
    event PriceReported(bytes32 indexed requestId, string latestPrice, uint timeStamp);

    // emits: OCRResponse event.
    event OCRResponse(bytes32 indexed requestId, bytes result, bytes err);

    constructor(
        address router,
        bytes32 _donId
    ) 
        ERC721("Tokenized Real Estate", "tRE")
        FunctionsClient(router) 
        ConfirmedOwner(msg.sender) 
    {
        i_functionsSource = new FunctionsSource();
        donId = _donId;
    }

    /**
     * @notice Set the DON ID
     * @param newDonId New DON ID
     */
    function setDonId(bytes32 newDonId) external onlyOwner {
        donId = newDonId;
    }

    // DEFAULT CONSUMER FUNCTIONS //

    /**
     * @notice Triggers an on-demand Functions request using remote encrypted secrets
     * @param source JavaScript source code
     * @param secretsLocation Location of secrets (only Location.Remote & Location.DONHosted are supported)
     * @param encryptedSecretsReference Reference pointing to encrypted secrets
     * @param args String arguments passed into the source code and accessible via the global variable `args`
     * @param bytesArgs Bytes arguments passed into the source code and accessible via the global variable `bytesArgs` as hex strings
     * @param subscriptionId Subscription ID used to pay for request (FunctionsConsumer contract address must first be added to the subscription)
     * @param callbackGasLimit Maximum amount of gas used to call the inherited `handleOracleFulfillment` method
     */

    function sendRequest(
        string calldata source,
        FunctionsRequest.Location secretsLocation,
        bytes calldata encryptedSecretsReference,
        string[] calldata args,
        bytes[] calldata bytesArgs,
        uint64 subscriptionId,
        uint32 callbackGasLimit
    ) external onlyOwner {
        FunctionsRequest.Request memory req;
        req.initializeRequest(
            FunctionsRequest.Location.Inline,
            FunctionsRequest.CodeLanguage.JavaScript,
            source
        );
        req.secretsLocation = secretsLocation;
        req.encryptedSecretsReference = encryptedSecretsReference;
        if (args.length > 0) {
            req.setArgs(args);
        }
        if (bytesArgs.length > 0) {
            req.setBytesArgs(bytesArgs);
        }
        s_latestRequestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            callbackGasLimit,
            donId
        );
    }

    /**
     * @notice Store latest result/error
     * @param requestId The request ID, returned by sendRequest()
     * @param response Aggregated response from the user code
     * @param err Aggregated error from the user code or from the execution pipeline
     * Either response or error parameter will be set, but never both
     */

    // function fulfillRequest(
    //     bytes32 requestId,
    //     bytes memory response,
    //     bytes memory err
    // ) internal override {
    //     s_latestResponse = response;
    //     s_latestError = err;

    //     // updates: latest request id.
    //     s_latestRequestId = requestId;
        
    //     // emits: OCRResponse event.
    //     emit OCRResponse(requestId, response, err);

    //     // converts: latest response to a (human-readable) string.
    //     latestPrice = string(abi.encodePacked(response));
    //     emit PriceReported(requestId, latestPrice, block.timestamp);
    // }

    // updates: `s_latestRequestId` and fulfills the request.
    function fulfillRequest(
        bytes32 requestId, 
        bytes memory response, 
        bytes memory err
    ) internal override {
        // [if] asset is requested for the first time.
        if (s_latestRequestId == requestId) {
            // [then] decode: response to get property details.
            (
                string memory homeAddress, 
                uint yearBuilt, 
                uint squareFootage
            ) =
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
                            '{"trait_type": "homeAddress",',
                            '"value": ',
                            homeAddress,
                            "}",
                            ',{"trait_type": "yearBuilt",',
                            '"value": ',
                            yearBuilt,
                            "}",
                            ',{"trait_type": "squareFootage",',
                            '"value": ',
                            squareFootage,
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
            (uint tokenId, uint listPrice, uint originalPrice, uint taxValue) =
                abi.decode(response, (uint, uint, uint, uint));
            // map: price details to the associated `tokenId`.
            s_priceDetails[tokenId] = 
                PriceDetails({
                    listPrice: uint80(listPrice),
                    originalPrice: uint80(originalPrice),
                    taxValue: uint80(taxValue)
                });
        }
    }

    // TOKENIZATION //

    // assigns: `requestId` to a given recipient, which includes a request that pulls NFT metadata.
    function issue(
        address recipientAddress, 
        uint64 subscriptionId,
        uint32 gasLimit,
        bytes32 donID
    )
        external
        onlyOwner
        returns (bytes32 requestId)
    {
        // if (s_latestRequestId != bytes32(0)) revert LatestIssueInProgress();
        // generates: request (`req`)
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(i_functionsSource.getNftMetadata());
        // gets: requestId from the _sendRequest, which includes the encodeCBOR from the request (`req`).
        requestId = _sendRequest(req.encodeCBOR(), subscriptionId, gasLimit, donID);
        // maps: requestId --> recipient 
        s_issueTo[requestId] = recipientAddress;
    }

    // updates: associated price details for a given `tokenId`.
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


    // VIEW FUNCTIONS //
    
    // gets: price details for a given `tokenId`
    function getPriceDetails(uint tokenId) external view returns (PriceDetails memory) {
        return s_priceDetails[tokenId];
    }

    // shows: total houses available from brokerage firm.
    function totalHouses() public view returns (uint) {
        return _totalHouses;
    }

    // ERC721 SETTINGS //

    // gets: tokenURI for a given `tokenId`.
    function tokenURI(uint tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory ) {
        return super.tokenURI(tokenId);
    }

    // checks: interface is supported by this contract.
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) { 
        return super.supportsInterface(interfaceId);
    }
}
