import { TokenList } from '@uniswap/token-lists'
import schema from '@uniswap/token-lists/src/tokenlist.schema.json'
import Ajv from 'ajv'
import contenthashToUri from './contenthashToUri'
import { parseENSAddress } from './parseENSAddress'
import uriToHttp from './uriToHttp'

const tokenListValidator = new Ajv({ allErrors: true }).compile(schema)

/**
 * Contains the logic for resolving a list URL to a validated token list
 * @param listUrl list url
 * @param resolveENSContentHash resolves an ens name to a contenthash
 */
export default async function getTokenList(
  listUrl: string,
  resolveENSContentHash?: (ensName: string) => Promise<string>
): Promise<any> {
  let response
    try {
      response = await fetch('/tokens/tokenlist.json')
      if (!response.ok) {
      
      }
      const json = await response.json()
      return json as TokenList
    } catch (error) {
      console.debug('Failed to fetch list', listUrl, error)
      
    }


   
}
