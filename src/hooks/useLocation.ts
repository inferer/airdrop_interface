import { useRouter } from "next/router"

export const useLocation = () => {
  const router = useRouter()

  return router
}