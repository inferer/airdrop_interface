// @ts-ignore
import axios from 'axios'
import { API_ROOT,USER_POOL_SERVICE_ROOT } from '../constants'

const instance = axios.create({
  baseURL: API_ROOT,
  timeout: 600000,
});

const userPoolService = axios.create({
  baseURL: USER_POOL_SERVICE_ROOT,
  timeout: 60000
})

const getHeaders = () => {
  
  // instance.defaults.headers.common['access_sign'] = access_sign == 'null' || !access_sign ? '' : access_sign
  // instance.defaults.headers.common['user_addr'] = user_addr
  // instance.defaults.headers.common['content'] = nowallet_content

  return {
    
  }
}

const processResult = (res: any, url?: string) => {
  
  return res
}

export function fetcher(url: string, data: any = {}) {
  
  let formatData = { ...data }
  getHeaders()
  return instance.get(url, { params: formatData }).then((res: { data: any; }) => processResult(res.data, url)).catch(() => {
    
  })
}

export function userPoolSrvcFetcher(url: string, data: any = {})
{
  let formatData = { ...data }
  getHeaders()
  return userPoolService.get(url, { params: formatData }).then((res: { data: any; }) => processResult(res.data, url))
}

export function fetcherServerSide(url: string, data: any) {
  let formatData = { ...data }

  return instance.get(url, { params: formatData }).then((res: { data: any; }) => res.data)
}

export function poster(url: string, data: any, options = {}) {
  let formatData = { ...data }

  getHeaders()
  return instance.post(url, formatData, { ...options }).then((res: { data: any; }) => processResult(res.data))
}

export function deleter(url: string, data: any, options = {}) {
  getHeaders()
  return instance.delete(url, data).then((res: { data: any; }) => processResult(res.data))
}

export function updater(url: string, data: any, options = {}) {
  getHeaders()
  return instance.put(url, data).then((res: { data: any; }) => processResult(res.data))
}

export function uploader(url: string, data: any) {
  return instance.post(
    url,
    data,
    {
      headers: {
        'Content-type': 'multipart/form-data', 
        "type": "formData",
        ...getHeaders()
      }
    })
    .then((res: { data: any; }) => processResult(res.data))
    .catch((e: any) => {
      return false
    })
}

export default instance