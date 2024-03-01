// import IndexPage from "../views/Swap";
import Router, { useRouter } from "next/router"
import { useEffect } from "react"

const IndexPage = () => {
  const router = useRouter()
  useEffect(() => {
    const isProjectMode = localStorage.getItem('airdrop_model')
    router.push(isProjectMode !== 'false' ? '/project/create' : '/user/collect')
  }, [])
  
  return null
}

export default IndexPage