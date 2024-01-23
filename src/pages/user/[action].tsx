import { useRouter } from "next/router";
import SearchPage from "../../views/Search";
import IndexPage from "../../views/Swap";
import TokensPage from "../../views/Tokens";
import CompletedPage from "../../views/Completed";

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
    if (router.query.action === 'completed') {
      return <CompletedPage />
    }
  }

  return (
    <IndexPage />
  )
}

export default UserPage
