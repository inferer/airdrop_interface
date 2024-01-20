// import IndexPage from "../views/Swap";
import Router from "next/router"
import { useEffect } from "react"

const IndexPage = () => {

  useEffect(() => {
    const isProjectMode = localStorage.getItem('airdrop_model')
    Router.push(isProjectMode === 'true' ? '/project/swap' : '/user/swap')
  }, [])
  
  return null
}

export default IndexPage