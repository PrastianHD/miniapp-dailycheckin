export const CHECKIN_CONTRACT_ADDRESS = '0x73A119f66397429CCc75cFfbD99c71673cC6DEae' as `0x${string}`
export const STAR_TOKEN_ADDRESS = '0x0cAEAF5D806afBb3908B65aB695B62f0fFEA0955' as `0x${string}`

export const CHECKIN_ABI = [
  { "inputs": [], "name": "checkIn", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }], "name": "getUserData", "outputs": [{ "internalType": "uint256", "name": "lastCheckIn", "type": "uint256" }, { "internalType": "uint256", "name": "streak", "type": "uint256" }, { "internalType": "uint256", "name": "potentialReward", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "getAllUsers", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function" }
] as const;

export const ERC20_ABI = [
  { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }
] as const;