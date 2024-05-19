import { IRY_GATEWAY } from "../constants";

export function openId(id: string) {
  window.open(`${IRY_GATEWAY}/${id}`, '_blank')
}

export function getIryPath(id: string) {
  return `${IRY_GATEWAY}/${id}`
}