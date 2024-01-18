import { useRouter } from "next/router";
import IndexPage from "../../views/Search";
import TokensPage from "../../views/Tokens";

function UserPage() {
  const router = useRouter()

  if (
    router.query.action === 'rewards' ||
    router.query.action === 'consumption'
  ) {
    return <TokensPage />
  }

  return (
    <IndexPage />
  )
}

export default UserPage
