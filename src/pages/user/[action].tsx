import { useRouter } from "next/router";
import SearchPage from "../../views/Search";
import IndexPage from "../../views/Swap";
import TokensPage from "../../views/Tokens";
import TasksPage from "../../views/Tasks";
import CompletedPage from "../../views/Completed";
import InviteCodePage from "../../views/InviteCode";
import AirdropDetails from "../../views/Collect/AirdropDetails";

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
    if (router.query.action === 'ongoing') {
      if (router.query.id) {
        return <AirdropDetails />
      }
      return <TasksPage />
    }
    if (router.query.action === 'completed') {
      return <CompletedPage />
    }
    if (router.query.action === 'invite') {
      return <InviteCodePage />
    }
  }

  return (
    <IndexPage />
  )
}

export default UserPage
