import { useRouter } from "next/router";
import SearchPage from "../../views/Search";
import IndexPage from "../../views/Swap";
import TokensPage from "../../views/Tokens";
import TasksPage from "../../views/Tasks";
import CompletedPage from "../../views/Completed";
import InviteCodePage from "../../views/InviteCode";
import AirdropDetails from "../../views/Collect/AirdropDetails";
import CollectPage from "../../views/Collect";

function UserPage() {
  const router = useRouter()
  const action = router.query.action ? router.query.action[0] : 'collect'
  const action1 = router.query.action ? router.query.action[1] : ''
  if (
    action === 'rewards' ||
    action === 'consumption'
  ) {
    return <TokensPage />
  }
  if (action === 'collect') {
    if (action1) {
      return <CollectPage />
    }
    return <SearchPage />
  }
  if (action === 'ongoing') {
    if (action1) {
      return <AirdropDetails />
    }
    return <TasksPage />
  }
  if (action === 'completed') {
    return <CompletedPage />
  }
  if (action === 'invite') {
    return <InviteCodePage />
  }

  return (
    <IndexPage />
  )
}

export default UserPage
