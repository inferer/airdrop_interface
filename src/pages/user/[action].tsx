import { useRouter } from "next/router";
import SearchPage from "../../views/Search";
import IndexPage from "../../views/Swap";
import TokensPage from "../../views/Tokens";

function UserPage() {
  const router = useRouter()
  console.log(router.query)
  if (
    router.query.action === 'rewards' ||
    router.query.action === 'consumption'
  ) {
    return <TokensPage />
  }
  if (router.pathname === '/user/[action]') {
    if (router.query.action === 'collect') {
      return <SearchPage />
    }
  }

  return (
    <IndexPage />
  )
}

export default UserPage
