'use client';
import Router, { useRouter } from "next/router"
import { useEffect } from "react"
import LandingPage from '../views/Landing'
import { INFERER_AIRDROP_SOURCE } from "../constants";

const IndexPage = () => {
  const router = useRouter()
  const source = router.query.source as string || ''
  useEffect(() => {
    localStorage.setItem(INFERER_AIRDROP_SOURCE, source)
    const isProjectMode = localStorage.getItem('airdrop_model')
    router.push(isProjectMode !== 'false' ? '/project/create' : '/user/collect')
  }, [])
  
  return <LandingPage />
}

export default IndexPage