// Contract address
export const STOCK_ORACLE_ADDRESS = "0xE1a0e1Df487bC32b48f58db680eC4363cbcc69c5";
// Contract ABI
export const STOCK_ORACLE_ABI = [
  {
    inputs: [

      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
      {
        internalType: "bytes4",
        name: "_symbol",
        type: "bytes4",
      },
      {
        internalType: "uint256",
        name: "_volume",
        type: "uint256",
      },
    ],
    name: "stockSet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "_symbol",
        type: "bytes4",
      },
    ],
    name: "getStocksVolume",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
  inputs: [
    {
      internalType: "bytes4",
      name: "_symbol",
      type: "bytes4",
    },
  ],
  name: "getStocksPrice",
  outputs: [
    {
      internalType: "uint256",
      name: "",
      type: "uint256",
    },
  ],
  stateMutability: "view",
  type: "function",
},
];
