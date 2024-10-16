import { useRouter } from "next/router";
import SearchPage from "../../views/Search";
import IndexPage from "../../views/Swap";
import TokensPage from "../../views/Tokens";
import TasksPage from "../../views/Tasks";
import CompletedPage from "../../views/Completed";
import InviteCodePage from "../../views/InviteCode";
import AirdropDetails from "../../views/Collect/AirdropDetails";
import CollectPage from "../../views/CollectRefer";
import UserCampaign from "../../views/Campaign/UserCampaign";
import ReferListPage from "../../views/Tasks/ReferListPage";

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
    if (action1) {
      return <AirdropDetails />
    }
    return <CompletedPage />
  }
  if (action === 'invite') {
    return <InviteCodePage />
  }
  if (action === 'campaign') {
    if (action1) {
      return <UserCampaign />
    }
    return <UserCampaign />
  }
  if (action === 'refer-list') {
    
    return <ReferListPage />
  }

  return (
    <IndexPage />
  )
}

export default UserPage
