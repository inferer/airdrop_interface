import React, { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from 'react-intersection-observer';

export interface LazyImageProps {
  src: string,
  activeSrc?: string,
  className?: string,
  alt?: string,
  others?: {[key: string]: string}
}

// const isDev = process.env.NODE_ENV === 'development'
const isDev = true

const LazyImage: React.FC<LazyImageProps> = ({ src, className, alt, ...others}) => {
  const [imgSrc, setImgSrc] = useState('')
  const { ref: inViewRef, inView, entry } = useInView({});
  useEffect(() => {
    if (inView && !imgSrc) {
      setImgSrc(isDev ? src : `https://website-1315068501.cos.ap-nanjing.myqcloud.com/airdrop_interface${src}`)
    }
    
  }, [inView, src, imgSrc])

  return (
    <img referrerPolicy="no-referrer" ref={inViewRef} src={imgSrc} className={ `transition-all ${!imgSrc ? 'opacity-0 ' : 'opacity-100 '} ${className}` } { ...others } alt={alt} />
  )
}

export const LazyImage3: React.FC<LazyImageProps> = ({ src, className, ...others}) => {
  const [imgSrc, setImgSrc] = useState('')
  const { ref: inViewRef, inView, entry } = useInView({});
  const imgRef = useRef<any>(null)
  useEffect(() => {
    if (inView && !imgSrc) {
      setImgSrc(src)
    }
    
  }, [inView, src, imgSrc])


  return (
    <img referrerPolicy="no-referrer" ref={inViewRef} src={imgSrc} className={ `transition-all ${!imgSrc ? 'opacity-0 ' : 'opacity-100 '} ${className}` } { ...others } alt="" onError={function() {
      if (imgSrc) {
        const errorPng = '/images/search/default.png'
        setImgSrc(isDev ? errorPng : `https://website-1315068501.cos.ap-nanjing.myqcloud.com/airdrop_interface${errorPng}`)
      }
    }} />
  )
}

export const LazyImage2: React.FC<LazyImageProps> = ({ src, className, ...others}) => {
  const [imgSrc, setImgSrc] = useState('')
  const { ref: inViewRef, inView, entry } = useInView({});
  useEffect(() => {
    if (inView) {
      setImgSrc(isDev ? src : `https://website-1315068501.cos.ap-nanjing.myqcloud.com/airdrop_interface${src}`)
    }
    
  }, [inView, src])

  return (
    <img referrerPolicy="no-referrer" ref={inViewRef} src={imgSrc} className={ `transition-all ${!imgSrc ? 'opacity-0 ' : 'opacity-100 '} ${className}` } { ...others } alt="" />
  )
}


export const LazyImage4: React.FC<LazyImageProps> = ({ src, activeSrc, className, ...others}) => {
  const [imgSrc, setImgSrc] = useState('')
  const { ref: inViewRef, inView, entry } = useInView({});
  useEffect(() => {
    if (inView) {
      setImgSrc(isDev ? src : `https://website-1315068501.cos.ap-nanjing.myqcloud.com/airdrop_interface${src}`)
    }
    
  }, [inView, src])

  const onMouseOver = useCallback(e => {
    e.stopPropagation()
    if (activeSrc) {
      setImgSrc(isDev ? activeSrc : `https://website-1315068501.cos.ap-nanjing.myqcloud.com/airdrop_interface${src}`)
    }
    
  }, [activeSrc])

  const onMouseLeave = useCallback(e => {
    e.stopPropagation()
    if (src) {
      setImgSrc(isDev ? src : `https://website-1315068501.cos.ap-nanjing.myqcloud.com/airdrop_interface${src}`)
    }
    
  }, [src])


  return (
    <img 
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      referrerPolicy="no-referrer" ref={inViewRef} src={imgSrc} className={ `transition-all ${!imgSrc ? 'opacity-0 ' : 'opacity-100 '} ${className}` } { ...others } alt="" />
  )
}




export default LazyImage