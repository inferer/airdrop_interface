'use client'

import Router, { useRouter } from "next/router"
import { useEffect } from "react"
import LandingPage from '../views/Landing'

const IndexPage = () => {
  const router = useRouter()
  useEffect(() => {
    const isProjectMode = localStorage.getItem('airdrop_model')
    router.push(isProjectMode !== 'false' ? '/project/create' : '/user/collect')
  }, [])
  
  return <LandingPage />
}

export default IndexPage