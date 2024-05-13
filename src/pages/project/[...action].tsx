import { useRouter } from "next/router";
import IndexPage from "../../views/Swap";
import TokensPage from "../../views/Tokens";
import OngoingPage from "../../views/Project/Ongoing";
import CompletedPage from "../../views/Project/Completed";
import InviteCodePage from "../../views/InviteCode";
import AirdropDetails from "../../views/Collect/AirdropDetails";
import CreatePage from "../../views/Create";
import CampaignPage from "../../views/Campaign";
import CampaignListPage from "../../views/CampaignList/Ongoing";
import CAmpaignDetails from '../../views/Campaign/CampaignDetails'
import AirAssetPage from "../../views/AirAsset";

function ProjectPage () {
  const router = useRouter()
  const action = router.query.action ? router.query.action[0] : 'create'
  const action1 = router.query.action ? router.query.action[1] : ''
  if (
    action === 'rewards' ||
    action === 'consumption'
  ) {
    return <TokensPage />
  }
  if (action === 'ongoing') {
    if (action1) {
      return <AirdropDetails />
    }
    return <OngoingPage />
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
  if (action === 'create') {
    if (action1) {
      return <CreatePage />
    }
  }
  if (action === 'airAsset') {
    return <AirAssetPage />
  }
  if (action === 'campaign') {
    if (action1) {
      return <CampaignPage />
    }
    return <CampaignListPage />
  }
  if (action === 'campaigns') {
    if (action1) {
      return <CAmpaignDetails />
    }
    return <CampaignListPage />
  }
  return (
    <IndexPage />
  )
}

export default ProjectPage
