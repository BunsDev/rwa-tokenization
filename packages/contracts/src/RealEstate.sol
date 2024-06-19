// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import { FunctionsClient } from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import { FunctionsRequest } from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";
import { ConfirmedOwner } from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";

/**
 * @title Chainlink Functions example consuming Real Estate API
 */
contract RealEstate is FunctionsClient, ConfirmedOwner {
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
    "url: `https://api.chateau.voyage/house/${id}`,"
    "});"
    "if (infoResponse.error) {"
    "throw Error('Housing Info Request Error');"
    "}"
    "const homeAddress = infoResponse.data.homeAddress;"
    "const yearBuilt = infoResponse.data.yearBuilt;"
    "return Functions.encodeString([homeAddress, yearBuilt]);";

  string private constant SOURCE_PRICE_INFO =
    "const id = args[0];"
    "const priceResponse = await Functions.makeHttpRequest({"
    "url: `https://api.chateau.voyage/house/${id}`,"
    "});"
    "if (priceResponse.error) {"
    "throw Error('Housing Price Request Error');"
    "}"
    "const price = priceResponse.data.listPrice;"
    "return Functions.encodeString(price);";

  bytes32 public donId; // DON ID for the Functions DON to which the requests are sent
  uint64 private subscriptionId; // Subscription ID for the Chainlink Functions
  uint32 private gasLimit; // Gas limit for the Chainlink Functions callbacks

  // Mapping of request IDs to API response info
  mapping(bytes32 => APIResponse) public requests;
  mapping(string => bytes32) public latestRequestId;

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
   * @notice Request `houseInfo` for a given `tokenId`
   * @param tokenId id of said token e.g. 0
   */
  function requestHouseInfo(string calldata tokenId) external {
    string[] memory args = new string[](1);
    args[0] = tokenId;
    bytes32 requestId = _sendRequest(SOURCE_HOUSE_INFO, args);

    requests[requestId].responseType = ResponseType.HouseInfo;
    requests[requestId].tokenId = tokenId;

    latestRequestId[tokenId] = requestId;
  
    emit HouseInfoRequested(requestId, tokenId);
  }

  /**
   * @notice Request `lastPrice` for a given `tokenId`
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
    if (requests[requestId].responseType == ResponseType.HouseInfo) {
      emit HouseInfoReceived(requestId, string(response));
    } else {
      emit LastPriceReceived(requestId, string(response));
    }
  }

  // CHAINLINK FUNCTIONS //

  /**
   * @notice Triggers an on-demand Functions request
   * @param args String arguments passed into the source code and accessible via the global variable `args`
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
}
