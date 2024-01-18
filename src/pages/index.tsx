// import IndexPage from "../views/Swap";
import Router from "next/router"
import { useEffect } from "react"

const IndexPage = () => {

  useEffect(() => {
    Router.push('/user/swap')
  }, [])
  
  return null
}

export default IndexPage