export const CREConsumerABI = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_forwarder",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_optionPricer",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_owner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "MAX_KI_PROB",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "MAX_PREMIUM",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "MIN_PREMIUM",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "acceptedPricings",
    "inputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "putPremiumBps",
        "type": "uint16",
        "internalType": "uint16"
      },
      {
        "name": "kiProbabilityBps",
        "type": "uint16",
        "internalType": "uint16"
      },
      {
        "name": "expectedKiLossBps",
        "type": "uint16",
        "internalType": "uint16"
      },
      {
        "name": "vegaBps",
        "type": "uint16",
        "internalType": "uint16"
      },
      {
        "name": "inputsHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "autocallEngine",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "expectedWorkflowOwner",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "forwarder",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getAcceptedPricing",
    "inputs": [
      {
        "name": "noteId",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct PricingResult",
        "components": [
          {
            "name": "putPremiumBps",
            "type": "uint16",
            "internalType": "uint16"
          },
          {
            "name": "kiProbabilityBps",
            "type": "uint16",
            "internalType": "uint16"
          },
          {
            "name": "expectedKiLossBps",
            "type": "uint16",
            "internalType": "uint16"
          },
          {
            "name": "vegaBps",
            "type": "uint16",
            "internalType": "uint16"
          },
          {
            "name": "inputsHash",
            "type": "bytes32",
            "internalType": "bytes32"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getNoteParams",
    "inputs": [
      {
        "name": "noteId",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct PricingParams",
        "components": [
          {
            "name": "basket",
            "type": "address[]",
            "internalType": "address[]"
          },
          {
            "name": "kiBarrierBps",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "couponBarrierBps",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "autocallTriggerBps",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "stepDownBps",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "maturityDays",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "numObservations",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "hasNoteParams",
    "inputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isPricingAccepted",
    "inputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "onReport",
    "inputs": [
      {
        "name": "metadata",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "report",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "optionPricer",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IOptionPricer"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "registerNoteParams",
    "inputs": [
      {
        "name": "noteId",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "params",
        "type": "tuple",
        "internalType": "struct PricingParams",
        "components": [
          {
            "name": "basket",
            "type": "address[]",
            "internalType": "address[]"
          },
          {
            "name": "kiBarrierBps",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "couponBarrierBps",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "autocallTriggerBps",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "stepDownBps",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "maturityDays",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "numObservations",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "renounceOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setAutocallEngine",
    "inputs": [
      {
        "name": "_engine",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setExpectedWorkflowOwner",
    "inputs": [
      {
        "name": "_owner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setForwarder",
    "inputs": [
      {
        "name": "_forwarder",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setOptionPricer",
    "inputs": [
      {
        "name": "_optionPricer",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "supportsInterface",
    "inputs": [
      {
        "name": "interfaceId",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "transferOwnership",
    "inputs": [
      {
        "name": "newOwner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "AutocallEngineUpdated",
    "inputs": [
      {
        "name": "newEngine",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ForwarderUpdated",
    "inputs": [
      {
        "name": "newForwarder",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "NoteParamsRegistered",
    "inputs": [
      {
        "name": "noteId",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [
      {
        "name": "previousOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PricingAccepted",
    "inputs": [
      {
        "name": "noteId",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "putPremiumBps",
        "type": "uint16",
        "indexed": false,
        "internalType": "uint16"
      },
      {
        "name": "kiProbabilityBps",
        "type": "uint16",
        "indexed": false,
        "internalType": "uint16"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "OwnableInvalidOwner",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "OwnableUnauthorizedAccount",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ]
  }
] as const;
