import { IRY_GATEWAY } from "../constants";

export function openId(id: string) {
  window.open(`${IRY_GATEWAY}/${id}`, '_blank')
}

export function getIryPath(id: string) {
  let _id = id
  if (id.indexOf('image-') === 0) {
    _id = id.slice(6)
  }
  if (id.indexOf('zip-') === 0) {
    _id = id.slice(4)
  }
  
  return `${IRY_GATEWAY}/${_id}`
}

export function getIryId(id: string) {
  let _id = id
  if (id.indexOf('image-') === 0) {
    _id = id.slice(6)
  }
  if (id.indexOf('zip-') === 0) {
    _id = id.slice(4)
  }
  
  return `${_id}`
}