import { useRouter } from "next/router";
import IndexPage from "../../views/Swap";
import TokensPage from "../../views/Tokens";
import OngoingPage from "../../views/Project/Ongoing";
import CompletedPage from "../../views/Project/Completed";
import InviteCodePage from "../../views/InviteCode";

function ProjectPage () {
  const router = useRouter()

  console.log(router.pathname)
  if (
    router.query.action === 'rewards' ||
    router.query.action === 'consumption'
  ) {
    return <TokensPage />
  }
  if (router.pathname === '/project/[action]') {
    if (router.query.action === 'ongoing') {
      return <OngoingPage />
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

export default ProjectPage
