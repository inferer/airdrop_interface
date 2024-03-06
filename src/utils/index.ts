import { Contract } from '@ethersproject/contracts'
import { ethers } from 'ethers';
import { getAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import { BigNumber } from '@ethersproject/bignumber'
import IUniswapV2Router02ABI from '@uniswap/v2-periphery/build/IUniswapV2Router02.json'
import ERC20_ABI from '../constants/abis/erc20.json'
import { ROUTER_ADDRESS } from '../constants'
import { ChainId, JSBI, Percent, Token, CurrencyAmount, Currency, ETHER } from '@uniswap/sdk'
import { TokenAddressMap } from '../state/lists/hooks'
import bscRpcProvider from './providers'

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

export function StringToBytes(str: string, byteSize = 32) {
  let inputByte32 = new Uint8Array(byteSize)
  // inputByte32.set((new TextEncoder()).encode(string))
  const encoder = new TextEncoder();
  encoder.encodeInto(str, inputByte32)
  return str;
}
export function ArrayNumToBytes(childArray: any[], byteSize = 32) {
  let arrayByte = childArray.map(item => {
    if (isNaN(item)) {
      throw "Not a number item: " + item;
    }
    else {
      return Number(item);
    }
  })
  let inputByte32 = new Uint8Array(byteSize)
  if (childArray.length <= byteSize) {
    inputByte32.set(arrayByte);
  }
  else {
    //slice input
    inputByte32.set(childArray.slice(0, byteSize));
  }
  return inputByte32;
}

export function verifyInput(inputValue: string, inputType: string) {
  console.log(inputValue, inputType)
  try {
    if (inputType.indexOf("[") > -1) {
      if (Array.isArray(JSON.parse(inputValue))) {
        let arrayType = inputType.slice(0, inputType.indexOf("["));
        let arrayInput = JSON.parse(inputValue).map((item: string) => {
          return formatInput(item, arrayType)
        });
        return arrayInput;
      } else {
        throw "Array is expected. Ex: [1,2,3]";
      }
    }
    else {
      if (inputType.indexOf("bytes") > -1) {
        let numByte = Number(inputType.substr(5));
        if (inputValue.indexOf('0x')) return true
        return false
      } else if(inputType === 'bool') {
        return inputValue === 'false' || inputValue === 'true' ? true : false
      } else if (inputType === 'address') {
        return !!isAddress(inputValue) 
      } else if (inputType.indexOf('uint') > -1) {
        return /^\d+$/.test(inputValue)
      }
      return true
    }
  } catch (error) {
    return false
  }
  
}


export function formatInput(inputValue: string, inputType: string) {
  try {
    if (inputType.indexOf("[") > -1) {
      if (Array.isArray(JSON.parse(inputValue))) {
        let arrayType = inputType.slice(0, inputType.indexOf("["));
        let arrayInput = JSON.parse(inputValue).map((item: string) => {
          return formatInput(item, arrayType)
        });
        return arrayInput;
      } else {
        throw "Array is expected. Ex: [1,2,3]";
      }
    }
    else {
      if (inputType.indexOf("bytes") > -1) {
        let numByte = Number(inputType.substr(5));
        try {
          if (Array.isArray(JSON.parse(inputValue))) {
            return ArrayNumToBytes(JSON.parse(inputValue), numByte)
          } else {
            throw "treat as string";
          }
        } catch (e) {
          //if error treat like string
          return StringToBytes(inputValue, numByte);
        }
      } else if(inputType === 'bool') {
        return inputValue === 'false' ? false : true
      }
      else {
        return inputValue;
      }
    }
  } catch (error) {
  }
  
}

const ETHERSCAN_PREFIXES: { [chainId in ChainId]: string } = {
  1: '',
  11155111: 'sepolia.',
  [ChainId.LOCAL]: 'Local'
}

export function openBrowser(url: string, target = '_blank') {
  window.open(url, target)
}

export function getEtherscanLink(chainId: ChainId, data: string, type: 'transaction' | 'token' | 'address'): string {
  const prefix = `https://${ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[1]}etherscan.io`

  switch (type) {
    case 'transaction': {
      return `${prefix}/tx/${data}`
    }
    case 'token': {
      return `${prefix}/token/${data}`
    }
    case 'address':
    default: {
      return `${prefix}/address/${data}`
    }
  }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address)
  if (!parsed) {
    // throw Error(`Invalid 'address' parameter '${address}'.`)
    return ''
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

// add 10%
export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000))
}

// converts a basis points value to a sdk percent
export function basisPointsToPercent(num: number): Percent {
  return new Percent(JSBI.BigInt(num), JSBI.BigInt(10000))
}

export function calculateSlippageAmount(value: CurrencyAmount, slippage: number): [JSBI, JSBI] {
  if (slippage < 0 || slippage > 10000) {
    throw Error(`Unexpected slippage value: ${slippage}`)
  }
  return [
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 - slippage)), JSBI.BigInt(10000)),
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 + slippage)), JSBI.BigInt(10000))
  ]
}

// account is not optional
export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

// account is optional
export function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library
}

// account is optional
export function getContract(address: string, ABI: any, library: Web3Provider, account?: string): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account) as any)
}

// // account is optional
// export function getContract2(address: string, ABI: any, library?: Web3Provider, account?: string): Contract {
//   if (!isAddress(address) || address === AddressZero) {
//     throw Error(`Invalid 'address' parameter '${address}'.`)
//   }

//   return new ethers.Contract(address, ABI, bscRpcProvider)
// }

// account is optional
export function getRouterContract(_: number, library: Web3Provider, account?: string): Contract {
  return getContract(ROUTER_ADDRESS, IUniswapV2Router02ABI.abi, library, account)
}
export function getERC20Contract(address: string, library: Web3Provider, account?: string): Contract {
  return getContract(address, ERC20_ABI, library, account)
}
export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export function isTokenOnList(defaultTokens: TokenAddressMap, currency?: Currency): boolean {
  if (currency === ETHER) return true
  return Boolean(currency instanceof Token && defaultTokens[currency.chainId]?.[currency.address])
}

export function addZero(m: number) {
  return m < 10 ? '0' + m : m;
}
export function transformTime(timestamp: number) {
  var time = new Date(timestamp);
  var y = time.getFullYear();
  var M = time.getMonth() + 1;
  var d = time.getDate();
  var h = time.getHours();
  var m = time.getMinutes();
  var s = time.getSeconds();

  return addZero(h) + ':' + addZero(m) + ' ' + addZero(M) + "/" + addZero(d) + ' ' + y;
}
