import Query from "@irys/query";
import { useShowToast } from "../state/application/hooks";
import { uploadContentToIry } from "../state/campaign/api";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getIryPath } from "../utils/iry";
import { fetcher } from "../utils/axios";

export function useIry() {
  const { handleShow } = useShowToast()
  const [uploadStatus, setUploadStatus] = useState(0)
  const iryQuery = new Query({ network: "devnet" });

  const handleUploadStr = useCallback(async (content: string) => {
    try {

      setUploadStatus(1)
      const formData = new FormData();
      formData.append('content', content)
      const res = await uploadContentToIry(formData)
      setUploadStatus(2)
      return res
    } catch (error) {
      setUploadStatus(0)
    }

  }, [setUploadStatus])

  const handleQueryContent = useCallback(async (id: string) => {
    const res = iryQuery.search("irys:transactions").ids([id])
    console.log((await res).toString())
  }, [iryQuery])

  return {
    uploadStatus,
    handleUploadStr,
    handleQueryContent
  }
}

export function useIrysQuery(id: string) {
  const [content, setContent] = useState('')
  
  useEffect(() => {
    if (id) {
      try {
        const url = getIryPath(id)
        fetcher(url)
          .then((res: string) => {
            setContent(res)
          })
      } catch (error) {
        
      }
      
    }
    
  }, [id])

  return content
}