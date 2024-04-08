import { Contract } from '@ethersproject/contracts'
import { ChainId, WETH } from '@uniswap/sdk'
import IUniswapV2PairABI from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { useMemo } from 'react'
import ENS_ABI from '../constants/abis/ens-registrar.json'
import ENS_PUBLIC_RESOLVER_ABI from '../constants/abis/ens-public-resolver.json'
import { ERC20_BYTES32_ABI } from '../constants/abis/erc20'
import ERC20_ABI from '../constants/abis/erc20.json'
import AlgToken_ABI from '../constants/abis/AlgToken.json'
import { MIGRATOR_ABI, MIGRATOR_ADDRESS } from '../constants/abis/migrator'
import UNISOCKS_ABI from '../constants/abis/unisocks.json'
import WETH_ABI from '../constants/abis/weth.json'
import { MULTICALL_ABI, MULTICALL_NETWORKS } from '../constants/multicall'
import { V1_EXCHANGE_ABI, V1_FACTORY_ABI, V1_FACTORY_ADDRESSES } from '../constants/v1'
import { getContract } from '../utils'
import { useActiveWeb3React } from './index'
import { AirdropSender_ABI, AirdropSender_NETWORKS } from '../constants/airdropSender'
import { AirdropReceiver_ABI, AirdropReceiver_NETWORKS } from '../constants/airdropReceiver'
import { AirdropManager_ABI, AirdropManager_NETWORKS } from '../constants/airdropManager'
import { AirdropTokenScore_ABI, AirdropTokenScore_NETWORKS } from '../constants/airdropTokenScore'
import { AirdropAssetTreasury_ABI, AirdropAssetTreasury_NETWORKS } from '../constants/airdropAssetTreasury'
import { PROJECTDEMO_ABI, PROJECTDEMO_NETWORKS } from '../constants/projectDemo'
import { AirdropUserTask_ABI, AirdropUserTask_NETWORKS } from '../constants/airdropUserTask'

// returns null on errors
function useContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
  const { library, account } = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

export function useV1FactoryContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && V1_FACTORY_ADDRESSES[chainId], V1_FACTORY_ABI, false)
}

export function useV2MigratorContract(): Contract | null {
  return useContract(MIGRATOR_ADDRESS, MIGRATOR_ABI, true)
}

export function useV1ExchangeContract(address?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, V1_EXCHANGE_ABI, withSignerIfPossible)
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useAlgTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, AlgToken_ABI, withSignerIfPossible)
}

export function useWETHContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? WETH[chainId].address : undefined, WETH_ABI, withSignerIfPossible)
}

export function useENSRegistrarContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  let address: string | undefined
  if (chainId) {
    switch (chainId) {
      case ChainId.MAINNET:
        address = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
        break
    }
  }
  return useContract(address, ENS_ABI, withSignerIfPossible)
}

export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(pairAddress, IUniswapV2PairABI.abi, withSignerIfPossible)
}

export function useMulticallContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && MULTICALL_NETWORKS[chainId], MULTICALL_ABI, false)
}

export function useAirdropSenderContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && AirdropSender_NETWORKS[chainId], AirdropSender_ABI, true)
}

export function useAirdropReceiverContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && AirdropReceiver_NETWORKS[chainId], AirdropReceiver_ABI, true)
}

export function useAirdropManagerContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && AirdropManager_NETWORKS[chainId], AirdropManager_ABI, true)
}

export function useAirdropUserTaskContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && AirdropUserTask_NETWORKS[chainId], AirdropUserTask_ABI, true)
}

export function useAirdropTokenScoreContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && AirdropTokenScore_NETWORKS[chainId], AirdropTokenScore_ABI, true)
}

export function useAirdropAssetTreasuryContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && AirdropAssetTreasury_NETWORKS[chainId], AirdropAssetTreasury_ABI, true)
}

export function useContractDemoContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && PROJECTDEMO_NETWORKS[chainId], PROJECTDEMO_ABI, true)
}

export function useSocksController(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(
    chainId === ChainId.MAINNET ? '0x65770b5283117639760beA3F867b69b3697a91dd' : undefined,
    UNISOCKS_ABI,
    false
  )
}
