import { Contract } from '@ethersproject/contracts'
import { ethers } from 'ethers';
import { getAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import { BigNumber } from '@ethersproject/bignumber'
import InfererRouter02ABI from '../constants/abis/InfererRouter02.json'
import ERC20_ABI from '../constants/abis/erc20.json'
import { OWER_ADDRESS, ROUTER_ADDRESS2 } from '../constants'
import { ChainId, JSBI, Percent, Token, CurrencyAmount, Currency, ETHER } from '@uniswap/sdk'
import { TokenAddressMap } from '../state/lists/hooks'

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
      } else if (inputType === 'string') {
        return inputValue.length > 0
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
  [ChainId.ARBITRUM]: 'arbitrum.',
  [ChainId.SEPOLIA]: 'sepolia.',
  [ChainId.LOCAL]: 'Local'
}

export function getRouterAddress(chaidId: ChainId) {
  return ROUTER_ADDRESS2[chaidId]
}

export function openBrowser(url: string, target = '_blank') {
  let newUrl = url
  if (url.indexOf('http') === 0) {
    newUrl = url
  } else {
    newUrl = url.replace(/https:\/\//gi, '');
    newUrl = newUrl.replace(/http:\/\//, '')
    newUrl = 'https://' + url
  }
  
  window.open(newUrl, target)
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


// account is optional
export function getRouterContract(_: number, library: Web3Provider, account?: string): Contract {
  const router02 = getRouterAddress(_)
  return getContract(router02, InfererRouter02ABI, library, account)
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
export function transformTime(timestamp: number, type?: number) {
  var time = new Date(timestamp);
  var y = time.getFullYear();
  var M = time.getMonth() + 1;
  var d = time.getDate();
  var h = time.getHours();
  var m = time.getMinutes();
  var s = time.getSeconds();
  if (type === 2) {
    return y + '-' + addZero(M) + '-' + addZero(d) + ' ' + addZero(h) + ':' + addZero(m) + ':' + addZero(s)
  }
  return addZero(h) + ':' + addZero(m) + ' ' + addZero(M) + "/" + addZero(d) + ' ' + y;
}

export function formatStringNumber(num: string = '', decimals = 3) {
  const idx = num.indexOf('.')
  const subLength = num.slice(idx).length
  if (subLength <= 3) return num
  return Number(num).toFixed(decimals)
}

export function upperCase0(str: string = '') {
  if (str) {
    let arr = str.split('')
    arr[0] = arr[0].toUpperCase()
    return arr.join('')
  }
  return str
}
export function zeroPadByte32(numberAsString:string){
  if(numberAsString.length === 66){
      return numberAsString;
  }
  if(numberAsString.indexOf("0x")>=0){
      numberAsString = numberAsString.slice(2);
  }
  return "0x" + ("0".repeat(64 - numberAsString.length)) + numberAsString;
}

export const getOwnerAddress = (chaidId?: ChainId) => {
  return chaidId && OWER_ADDRESS[chaidId]
}

export function randomStr(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
}
 