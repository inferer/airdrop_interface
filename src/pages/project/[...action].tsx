import { useRouter } from "next/router";
import IndexPage from "../../views/Swap";
import TokensPage from "../../views/Tokens";
import OngoingPage from "../../views/Project/Ongoing";
import CompletedPage from "../../views/Project/Completed";
import InviteCodePage from "../../views/InviteCode";
import AirdropDetails from "../../views/Collect/AirdropDetails";
import CreatePage from "../../views/Create";

function ProjectPage () {
  const router = useRouter()
  console.log(router)
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
  return (
    <IndexPage />
  )
}

export default ProjectPage
