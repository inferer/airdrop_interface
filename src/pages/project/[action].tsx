import { useRouter } from "next/router";
import IndexPage from "../../views/Swap";
import TokensPage from "../../views/Tokens";

function ProjectPage () {
  const router = useRouter()

  console.log(router.pathname)
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

export default ProjectPage
