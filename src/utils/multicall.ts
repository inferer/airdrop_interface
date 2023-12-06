import { Contract, ethers } from 'ethers'

export interface Call {
  address: string // Address of the contract
  name: string // Function name on the contract (example: balanceOf)
  params?: any[] // Function params
}

interface MulticallOptions {
  requireSuccess?: boolean
}

const multicall = async <T = any>(multi: Contract, abi: any[], calls: Call[]): Promise<T> => {
  try {
    const itf = new ethers.utils.Interface(abi)

    const calldata = calls.map((call) => [call.address.toLowerCase(), itf.encodeFunctionData(call.name, call.params)])
    const { returnData } = await multi.aggregate(calldata)
    const res = returnData.map((call: any, i: number) => itf.decodeFunctionResult(calls[i].name, call))
    return res
  } catch (error) {
    console.log(error)
    return calls.map(() => null) as any
  }
}


export default multicall