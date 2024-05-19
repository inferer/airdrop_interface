import { fetcher, poster, uploader, userPoolSrvcFetcher } from "../../utils/axios"

export const uploadFileToIry = async (
  formData: FormData
) => {
  const res = await uploader(`/api/campaign/iry`, formData )

  return res && res.data || {}
}
