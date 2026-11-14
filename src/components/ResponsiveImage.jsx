import { useState } from 'react'
import { getImage } from '../lib/images'
import Logo from './Logo'

export default function ResponsiveImage({ imageKey, alt, sizes = '100vw', priority = false, className = '', ...rest }) {
  const [failed, setFailed] = useState(false)
  const image = getImage(imageKey)

  if (!image || failed) {
    return (
      <div role="img" aria-label={alt} className={`${className} flex items-center justify-center bg-brown-deep`}>
        <Logo variant="amber" alt="" className="w-2/5 max-w-40 opacity-50" />
      </div>
    )
  }

  return (
    <img
      src={image.src}
      srcSet={image.srcSet}
      sizes={sizes}
      width={image.width}
      height={image.height}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  )
}
