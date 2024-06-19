export const weatherConsumerABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: 'router', internalType: 'address', type: 'address' },
      { name: '_donId', internalType: 'bytes32', type: 'bytes32' },
      { name: '_source', internalType: 'string', type: 'string' },
      { name: '_subscriptionId', internalType: 'uint64', type: 'uint64' },
      { name: '_gasLimit', internalType: 'uint32', type: 'uint32' },
    ],
  },
  { type: 'error', inputs: [], name: 'EmptyArgs' },
  { type: 'error', inputs: [], name: 'EmptySource' },
  { type: 'error', inputs: [], name: 'NoInlineSecrets' },
  { type: 'error', inputs: [], name: 'OnlyRouterCanFulfill' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferRequested',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'error', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'RequestFailed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'bytes32', type: 'bytes32', indexed: true },
    ],
    name: 'RequestFulfilled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'bytes32', type: 'bytes32', indexed: true },
    ],
    name: 'RequestSent',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'requestId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'temperature',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'WeatherInfoReceived',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'requestId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      { name: 'lat', internalType: 'string', type: 'string', indexed: false },
      { name: 'long', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'WeatherInfoRequested',
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'acceptOwnership',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'donId',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'requestId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'response', internalType: 'bytes', type: 'bytes' },
      { name: 'err', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'handleOracleFulfillment',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'lat', internalType: 'string', type: 'string' },
      { name: 'long', internalType: 'string', type: 'string' },
    ],
    name: 'requestWeatherInfo',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'requests',
    outputs: [
      { name: 'lat', internalType: 'string', type: 'string' },
      { name: 'long', internalType: 'string', type: 'string' },
      { name: 'temperature', internalType: 'string', type: 'string' },
      { name: 'timestamp', internalType: 'uint64', type: 'uint64' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newDonId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'setDonId',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'to', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
  },
] as const


export const realEstateABI = [
  {
      type: "constructor",
      inputs: [
          {
              name: "router",
              type: "address",
              internalType: "address"
          },
          {
              name: "_donId",
              type: "bytes32",
              internalType: "bytes32"
          },
          {
              name: "_subscriptionId",
              type: "uint64",
              internalType: "uint64"
          },
          {
              name: "_gasLimit",
              type: "uint32",
              internalType: "uint32"
          }
      ],
      stateMutability: "nonpayable"
  },
  {
      type: "function",
      name: "acceptOwnership",
      inputs: [],
      outputs: [],
      stateMutability: "nonpayable"
  },
  {
      type: "function",
      name: "approve",
      inputs: [
          {
              name: "to",
              type: "address",
              internalType: "address"
          },
          {
              name: "tokenId",
              type: "uint256",
              internalType: "uint256"
          }
      ],
      outputs: [],
      stateMutability: "nonpayable"
  },
  {
      type: "function",
      name: "balanceOf",
      inputs: [
          {
              name: "owner",
              type: "address",
              internalType: "address"
          }
      ],
      outputs: [
          {
              name: "",
              type: "uint256",
              internalType: "uint256"
          }
      ],
      stateMutability: "view"
  },
  {
      type: "function",
      name: "burn",
      inputs: [
          {
              name: "tokenId",
              type: "uint256",
              internalType: "uint256"
          }
      ],
      outputs: [],
      stateMutability: "nonpayable"
  },
  {
      type: "function",
      name: "donId",
      inputs: [],
      outputs: [
          {
              name: "",
              type: "bytes32",
              internalType: "bytes32"
          }
      ],
      stateMutability: "view"
  },
  {
      type: "function",
      name: "getApproved",
      inputs: [
          {
              name: "tokenId",
              type: "uint256",
              internalType: "uint256"
          }
      ],
      outputs: [
          {
              name: "",
              type: "address",
              internalType: "address"
          }
      ],
      stateMutability: "view"
  },
  {
      type: "function",
      name: "handleOracleFulfillment",
      inputs: [
          {
              name: "requestId",
              type: "bytes32",
              internalType: "bytes32"
          },
          {
              name: "response",
              type: "bytes",
              internalType: "bytes"
          },
          {
              name: "err",
              type: "bytes",
              internalType: "bytes"
          }
      ],
      outputs: [],
      stateMutability: "nonpayable"
  },
  {
      type: "function",
      name: "isApprovedForAll",
      inputs: [
          {
              name: "owner",
              type: "address",
              internalType: "address"
          },
          {
              name: "operator",
              type: "address",
              internalType: "address"
          }
      ],
      outputs: [
          {
              name: "",
              type: "bool",
              internalType: "bool"
          }
      ],
      stateMutability: "view"
  },
  {
      type: "function",
      name: "issueHouse",
      inputs: [
          {
              name: "recipientAddress",
              type: "address",
              internalType: "address"
          }
      ],
      outputs: [],
      stateMutability: "nonpayable"
  },
  {
      type: "function",
      name: "latestPrice",
      inputs: [
          {
              name: "",
              type: "string",
              internalType: "string"
          }
      ],
      outputs: [
          {
              name: "",
              type: "string",
              internalType: "string"
          }
      ],
      stateMutability: "view"
  },
  {
      type: "function",
      name: "latestRequestId",
      inputs: [
          {
              name: "",
              type: "string",
              internalType: "string"
          }
      ],
      outputs: [
          {
              name: "",
              type: "bytes32",
              internalType: "bytes32"
          }
      ],
      stateMutability: "view"
  },
  {
      type: "function",
      name: "name",
      inputs: [],
      outputs: [
          {
              name: "",
              type: "string",
              internalType: "string"
          }
      ],
      stateMutability: "view"
  },
  {
      type: "function",
      name: "owner",
      inputs: [],
      outputs: [
          {
              name: "",
              type: "address",
              internalType: "address"
          }
      ],
      stateMutability: "view"
  },
  {
      type: "function",
      name: "ownerOf",
      inputs: [
          {
              name: "tokenId",
              type: "uint256",
              internalType: "uint256"
          }
      ],
      outputs: [
          {
              name: "",
              type: "address",
              internalType: "address"
          }
      ],
      stateMutability: "view"
  },
  {
      type: "function",
      name: "requestLastPrice",
      inputs: [
          {
              name: "tokenId",
              type: "string",
              internalType: "string"
          }
      ],
      outputs: [],
      stateMutability: "nonpayable"
  },
  {
      type: "function",
      name: "requests",
      inputs: [
          {
              name: "",
              type: "bytes32",
              internalType: "bytes32"
          }
      ],
      outputs: [
          {
              name: "responseType",
              type: "uint8",
              internalType: "enum RealEstate.ResponseType"
          },
          {
              name: "tokenId",
              type: "string",
              internalType: "string"
          },
          {
              name: "response",
              type: "string",
              internalType: "string"
          }
      ],
      stateMutability: "view"
  },
  {
      type: "function",
      name: "safeTransferFrom",
      inputs: [
          {
              name: "from",
              type: "address",
              internalType: "address"
          },
          {
              name: "to",
              type: "address",
              internalType: "address"
          },
          {
              name: "tokenId",
              type: "uint256",
              internalType: "uint256"
          }
      ],
      outputs: [],
      stateMutability: "nonpayable"
  },
  {
      type: "function",
      name: "safeTransferFrom",
      inputs: [
          {
              name: "from",
              type: "address",
              internalType: "address"
          },
          {
              name: "to",
              type: "address",
              internalType: "address"
          },
          {
              name: "tokenId",
              type: "uint256",
              internalType: "uint256"
          },
          {
              name: "data",
              type: "bytes",
              internalType: "bytes"
          }
      ],
      outputs: [],
      stateMutability: "nonpayable"
  },
  {
      type: "function",
      name: "setApprovalForAll",
      inputs: [
          {
              name: "operator",
              type: "address",
              internalType: "address"
          },
          {
              name: "approved",
              type: "bool",
              internalType: "bool"
          }
      ],
      outputs: [],
      stateMutability: "nonpayable"
  },
  {
      type: "function",
      name: "setCallbackGasLimit",
      inputs: [
          {
              name: "newGasLimit",
              type: "uint32",
              internalType: "uint32"
          }
      ],
      outputs: [],
      stateMutability: "nonpayable"
  },
  {
      type: "function",
      name: "setDonId",
      inputs: [
          {
              name: "newDonId",
              type: "bytes32",
              internalType: "bytes32"
          }
      ],
      outputs: [],
      stateMutability: "nonpayable"
  },
  {
      type: "function",
      name: "supportsInterface",
      inputs: [
          {
              name: "interfaceId",
              type: "bytes4",
              internalType: "bytes4"
          }
      ],
      outputs: [
          {
              name: "",
              type: "bool",
              internalType: "bool"
          }
      ],
      stateMutability: "view"
  },
  {
      type: "function",
      name: "symbol",
      inputs: [],
      outputs: [
          {
              name: "",
              type: "string",
              internalType: "string"
          }
      ],
      stateMutability: "view"
  },
  {
      type: "function",
      name: "tokenURI",
      inputs: [
          {
              name: "tokenId",
              type: "uint256",
              internalType: "uint256"
          }
      ],
      outputs: [
          {
              name: "",
              type: "string",
              internalType: "string"
          }
      ],
      stateMutability: "view"
  },
  {
      type: "function",
      name: "totalHouses",
      inputs: [],
      outputs: [
          {
              name: "",
              type: "uint256",
              internalType: "uint256"
          }
      ],
      stateMutability: "view"
  },
  {
      type: "function",
      name: "transferFrom",
      inputs: [
          {
              name: "from",
              type: "address",
              internalType: "address"
          },
          {
              name: "to",
              type: "address",
              internalType: "address"
          },
          {
              name: "tokenId",
              type: "uint256",
              internalType: "uint256"
          }
      ],
      outputs: [],
      stateMutability: "nonpayable"
  },
  {
      type: "function",
      name: "transferOwnership",
      inputs: [
          {
              name: "to",
              type: "address",
              internalType: "address"
          }
      ],
      outputs: [],
      stateMutability: "nonpayable"
  },
  {
      type: "event",
      name: "Approval",
      inputs: [
          {
              name: "owner",
              type: "address",
              indexed: true,
              internalType: "address"
          },
          {
              name: "approved",
              type: "address",
              indexed: true,
              internalType: "address"
          },
          {
              name: "tokenId",
              type: "uint256",
              indexed: true,
              internalType: "uint256"
          }
      ],
      anonymous: false
  },
  {
      type: "event",
      name: "ApprovalForAll",
      inputs: [
          {
              name: "owner",
              type: "address",
              indexed: true,
              internalType: "address"
          },
          {
              name: "operator",
              type: "address",
              indexed: true,
              internalType: "address"
          },
          {
              name: "approved",
              type: "bool",
              indexed: false,
              internalType: "bool"
          }
      ],
      anonymous: false
  },
  {
      type: "event",
      name: "BatchMetadataUpdate",
      inputs: [
          {
              name: "_fromTokenId",
              type: "uint256",
              indexed: false,
              internalType: "uint256"
          },
          {
              name: "_toTokenId",
              type: "uint256",
              indexed: false,
              internalType: "uint256"
          }
      ],
      anonymous: false
  },
  {
      type: "event",
      name: "HouseInfoReceived",
      inputs: [
          {
              name: "requestId",
              type: "bytes32",
              indexed: true,
              internalType: "bytes32"
          },
          {
              name: "response",
              type: "string",
              indexed: false,
              internalType: "string"
          }
      ],
      anonymous: false
  },
  {
      type: "event",
      name: "HouseInfoRequested",
      inputs: [
          {
              name: "requestId",
              type: "bytes32",
              indexed: true,
              internalType: "bytes32"
          },
          {
              name: "tokenId",
              type: "string",
              indexed: false,
              internalType: "string"
          }
      ],
      anonymous: false
  },
  {
      type: "event",
      name: "LastPriceReceived",
      inputs: [
          {
              name: "requestId",
              type: "bytes32",
              indexed: true,
              internalType: "bytes32"
          },
          {
              name: "response",
              type: "string",
              indexed: false,
              internalType: "string"
          }
      ],
      anonymous: false
  },
  {
      type: "event",
      name: "LastPriceRequested",
      inputs: [
          {
              name: "requestId",
              type: "bytes32",
              indexed: true,
              internalType: "bytes32"
          },
          {
              name: "tokenId",
              type: "string",
              indexed: false,
              internalType: "string"
          }
      ],
      anonymous: false
  },
  {
      type: "event",
      name: "MetadataUpdate",
      inputs: [
          {
              name: "_tokenId",
              type: "uint256",
              indexed: false,
              internalType: "uint256"
          }
      ],
      anonymous: false
  },
  {
      type: "event",
      name: "OwnershipTransferRequested",
      inputs: [
          {
              name: "from",
              type: "address",
              indexed: true,
              internalType: "address"
          },
          {
              name: "to",
              type: "address",
              indexed: true,
              internalType: "address"
          }
      ],
      anonymous: false
  },
  {
      type: "event",
      name: "OwnershipTransferred",
      inputs: [
          {
              name: "from",
              type: "address",
              indexed: true,
              internalType: "address"
          },
          {
              name: "to",
              type: "address",
              indexed: true,
              internalType: "address"
          }
      ],
      anonymous: false
  },
  {
      type: "event",
      name: "RequestFailed",
      inputs: [
          {
              name: "error",
              type: "bytes",
              indexed: false,
              internalType: "bytes"
          }
      ],
      anonymous: false
  },
  {
      type: "event",
      name: "RequestFulfilled",
      inputs: [
          {
              name: "id",
              type: "bytes32",
              indexed: true,
              internalType: "bytes32"
          }
      ],
      anonymous: false
  },
  {
      type: "event",
      name: "RequestSent",
      inputs: [
          {
              name: "id",
              type: "bytes32",
              indexed: true,
              internalType: "bytes32"
          }
      ],
      anonymous: false
  },
  {
      type: "event",
      name: "Transfer",
      inputs: [
          {
              name: "from",
              type: "address",
              indexed: true,
              internalType: "address"
          },
          {
              name: "to",
              type: "address",
              indexed: true,
              internalType: "address"
          },
          {
              name: "tokenId",
              type: "uint256",
              indexed: true,
              internalType: "uint256"
          }
      ],
      anonymous: false
  },
  {
      type: "error",
      name: "ERC721IncorrectOwner",
      inputs: [
          {
              name: "sender",
              type: "address",
              internalType: "address"
          },
          {
              name: "tokenId",
              type: "uint256",
              internalType: "uint256"
          },
          {
              name: "owner",
              type: "address",
              internalType: "address"
          }
      ]
  },
  {
      type: "error",
      name: "ERC721InsufficientApproval",
      inputs: [
          {
              name: "operator",
              type: "address",
              internalType: "address"
          },
          {
              name: "tokenId",
              type: "uint256",
              internalType: "uint256"
          }
      ]
  },
  {
      type: "error",
      name: "ERC721InvalidApprover",
      inputs: [
          {
              name: "approver",
              type: "address",
              internalType: "address"
          }
      ]
  },
  {
      type: "error",
      name: "ERC721InvalidOperator",
      inputs: [
          {
              name: "operator",
              type: "address",
              internalType: "address"
          }
      ]
  },
  {
      type: "error",
      name: "ERC721InvalidOwner",
      inputs: [
          {
              name: "owner",
              type: "address",
              internalType: "address"
          }
      ]
  },
  {
      type: "error",
      name: "ERC721InvalidReceiver",
      inputs: [
          {
              name: "receiver",
              type: "address",
              internalType: "address"
          }
      ]
  },
  {
      type: "error",
      name: "ERC721InvalidSender",
      inputs: [
          {
              name: "sender",
              type: "address",
              internalType: "address"
          }
      ]
  },
  {
      type: "error",
      name: "ERC721NonexistentToken",
      inputs: [
          {
              name: "tokenId",
              type: "uint256",
              internalType: "uint256"
          }
      ]
  },
  {
      type: "error",
      name: "EmptyArgs",
      inputs: []
  },
  {
      type: "error",
      name: "EmptySource",
      inputs: []
  },
  {
      type: "error",
      name: "NoInlineSecrets",
      inputs: []
  },
  {
      type: "error",
      name: "OnlyRouterCanFulfill",
      inputs: []
  }
] as const