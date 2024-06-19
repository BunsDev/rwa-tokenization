// Warning: Do not copy/paste this code
// Please refer to the supplied example code in the
// repository instead.
// The code here has been slightly changed to escape
// special characters in order to be displayed on the
// web-page.
export const CONTRACT_CODE = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import { FunctionsClient } from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import { FunctionsRequest } from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";
import { ConfirmedOwner } from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { ERC721URIStorage } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import { ERC721Burnable } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

/**
 * @title Chainlink Functions example consuming Real Estate API
 */
contract RealEstate is FunctionsClient, ConfirmedOwner,
    ERC721("Tokenized Real Estate", "tRE"), ERC721URIStorage, ERC721Burnable
 {
  using FunctionsRequest for FunctionsRequest.Request;

  enum ResponseType {
    HouseInfo,
    LastPrice
  }

  struct APIResponse {
    ResponseType responseType;
    string tokenId;
    string response;
  }

  // Chainlink Functions script soruce code
  string private constant SOURCE_HOUSE_INFO =
    "const id = args[0];"
    "const infoResponse = await Functions.makeHttpRequest({"
    "url: \`https://api.chateau.voyage/house/\${id}\`,"
    "});"
    "if (infoResponse.error) {"
    "throw Error('Housing Info Request Error');"
    "}"
    "const streetNumber = infoResponse.data.streetNumber;"
    "const streetName = infoResponse.data.streetName;"
    "const yearBuilt = infoResponse.data.yearBuilt;"
    "return Functions.encodeString([streetNumber, streetName, yearBuilt]);";

  string private constant SOURCE_PRICE_INFO =
    "const id = args[0];"
    "const priceResponse = await Functions.makeHttpRequest({"
    "url: \`https://api.chateau.voyage/house/\${id}\`,"
    "});"
    "if (priceResponse.error) {"
    "throw Error('Housing Price Request Error');"
    "}"
    "const price = priceResponse.data.listPrice;"
    "return Functions.encodeString(price);";

  bytes32 public donId; // DON ID for the Functions DON to which the requests are sent
  uint64 private subscriptionId; // Subscription ID for the Chainlink Functions
  uint32 private gasLimit; // Gas limit for the Chainlink Functions callbacks

  uint private _totalHouses;

  // Mapping of request IDs to API response info
  mapping(bytes32 => APIResponse) public requests;
  mapping(string => bytes32) public latestRequestId;
  mapping(string => string) public latestPrice;

  event HouseInfoRequested(bytes32 indexed requestId, string tokenId);
  event HouseInfoReceived(bytes32 indexed requestId, string response);

  event LastPriceRequested(bytes32 indexed requestId, string tokenId);
  event LastPriceReceived(bytes32 indexed requestId, string response);

  event RequestFailed(bytes error);

  constructor(
    address router,
    bytes32 _donId,
    uint64 _subscriptionId,
    uint32 _gasLimit
  ) FunctionsClient(router) ConfirmedOwner(msg.sender) {
    donId = _donId;
    subscriptionId = _subscriptionId;
    gasLimit = _gasLimit;
  }

  /**
   * @notice Request \`houseInfo\` for a given \`tokenId\`
   */
  function issueHouse(address recipientAddress) external {
    _totalHouses++;
    string memory tokenId = string(abi.encode(_totalHouses-1));
    
    string[] memory args = new string[](1);
    args[0] = tokenId;
    bytes32 requestId = _sendRequest(SOURCE_HOUSE_INFO, args);

    requests[requestId].responseType = ResponseType.HouseInfo;
    requests[requestId].tokenId = tokenId;

    latestRequestId[tokenId] = requestId;

    _mint(recipientAddress, _totalHouses);

    emit HouseInfoRequested(requestId, tokenId);
  }

  /**
   * @notice Request \`lastPrice\` for a given \`tokenId\`
   * @param tokenId id of said token e.g. 0
   */
  function requestLastPrice(string calldata tokenId) external {
    string[] memory args = new string[](1);
    args[0] = tokenId;
    bytes32 requestId = _sendRequest(SOURCE_PRICE_INFO, args);

    requests[requestId].responseType = ResponseType.LastPrice;
    requests[requestId].tokenId = tokenId;

    latestRequestId[tokenId] = requestId;

    emit LastPriceRequested(requestId, tokenId);
  }

  /**
   * @notice Process the response from the executed Chainlink Functions script
   * @param requestId The request ID
   * @param response The response from the Chainlink Functions script
   */
  function _processResponse(bytes32 requestId, bytes memory response) private {
    requests[requestId].response = string(response);
    string memory tokenId = requests[requestId].tokenId;

    if (requests[requestId].responseType == ResponseType.HouseInfo) {
      emit HouseInfoReceived(requestId, string(response));
    } else {
      // store: latest price for a given \`requestId\`.
      latestPrice[tokenId] = string(response);
      emit LastPriceReceived(requestId, string(response));
    }
  }

  // CHAINLINK FUNCTIONS //

  /**
   * @notice Triggers an on-demand Functions request
   * @param args String arguments passed into the source code and accessible via the global variable \`args\`
   */
  function _sendRequest(
    string memory source,
    string[] memory args
  ) internal returns (bytes32 requestId) {
    FunctionsRequest.Request memory req;
    req.initializeRequest(
      FunctionsRequest.Location.Inline, 
      FunctionsRequest.CodeLanguage.JavaScript, 
      source
    );
    if (args.length > 0) {
      req.setArgs(args);
    }
    requestId = _sendRequest(req.encodeCBOR(), subscriptionId, gasLimit, donId);
  }

  /**
   * @notice Fulfillment callback function
   * @param requestId The request ID, returned by sendRequest()
   * @param response Aggregated response from the user code
   * @param err Aggregated error from the user code or from the execution pipeline
   * Either response or error parameter will be set, but never both
   */
  function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal override {
    if (err.length > 0) {
      emit RequestFailed(err);
      return;
    }
    _processResponse(requestId, response);
  }

  // OWNER //

  /**
   * @notice Set the DON ID
   * @param newDonId New DON ID
   */
  function setDonId(bytes32 newDonId) external onlyOwner {
    donId = newDonId;
  }

  /**
   * @notice Set the gas limit
   * @param newGasLimit new gas limit
   */
  function setCallbackGasLimit(uint32 newGasLimit) external onlyOwner {
    gasLimit = newGasLimit;
  }

    // ERC721 SETTINGS //

    // gets: tokenURI for a given \`tokenId\`.
    function tokenURI(uint tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory ) {
        return super.tokenURI(tokenId);
    }

    // checks: interface is supported by this contract.
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) { 
        return super.supportsInterface(interfaceId);
    }

    function totalHouses() public view returns (uint) {
      return _totalHouses;
    }
}
`

export const TABS = [
  {
    label: 'Imports and Inheritance',
    content:
      'This is where we tell our smart contract that we want to use Chainlink Functions.',
    highlightedLines: Array.from({ length: 7 }, (v, k) => 4 + k),
  },
  {
    label: 'JavaScript Source',
    content:
      'This is where the JavaScript code that Chainlink Functions will execute is stored. By storing it on-chain, we have guarantees that this and only this code will be executed.',
    highlightedLines: Array.from({ length: 23 }, (v, k) => 31 + k),
  },
  {
    label: 'Subscription ID',
    content:
      'This is where the Chainlink Functions <a class="explainer-link" href="https://docs.chain.link/chainlink-functions/resources/subscriptions">subscription ID</a> is stored. This is required for your smart contract to use Chainlink Functions.',
    highlightedLines: [56],
  },
  {
    label: 'Functions Initialization',
    content:
      'In this contract\'s constructor, we set some Chainlink Functions specific configuration values such as the <a class="explainer-link" href="https://docs.chain.link/chainlink-functions/supported-networks">DON ID</a>, Functions <a class="explainer-link" href="https://docs.chain.link/chainlink-functions/resources/subscriptions">subscription ID</a> and gas limit for the callback transaction.',
    highlightedLines: Array.from({ length: 19 }, (v, k) => 74 + k),
  },
  {
    label: 'Functions Request',
    content:
      'This is the function called by the UI when a new request is initiated. It sends the request to the Chainlink Functions DoN, along with all associated parameters, such as the JavaScript code to execute, subscription ID, gas limit for the callback transaction, and DoN ID of the Chainlink Functions network we wish to execute the code on.',
    highlightedLines: Array.from({ length: 29 }, (v, k) => 85 + k),
  },
  {
    label: 'Functions Response',
    content:
      'This is the function called by the Chainlink Functions DoN when it receives a response from the JavaScript code executed off-chain in the Chainlink Function.',
    highlightedLines: Array.from({ length: 17 }, (v, k) => 123 + k),
  },
]
