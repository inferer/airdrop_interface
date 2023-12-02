import React from "react"

const Text: React.FC<{
  children: React.ReactNode,
  className?: string,
}> = ({
  children,
  className,

}) => {
  return (
    <span className={`text-[#000] font-fnormal  ${className}`}>{ children }</span>
  )
}

export const TextGray: React.FC<{
  children: React.ReactNode,
  className?: string
}> = ({
  children,
  className
}) => {
  return (
    <Text className={`text-[rgba(0,0,0,0.30)]  ${className}`}>{ children }</Text>
  )
}

export const TextGrad: React.FC<{
  children: React.ReactNode,
  className?: string
}> = ({
  children,
  className
}) => {
  return (
    <Text className={`text-[rgba(0,0,0,0.30)]  ${className}`}>{ children }</Text>
  )
}


export default Text