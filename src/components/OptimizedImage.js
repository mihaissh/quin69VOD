import { useState } from 'react';

/**
 * OptimizedImage component that supports WebP with fallback
 * Automatically detects browser support and loads the appropriate format
 */
export function OptimizedImage({ webpSrc, fallbackSrc, alt, style, className, onLoad, onError }) {
  const [error, setError] = useState(false);
  
  // Check if browser supports WebP
  const supportsWebP = typeof document !== 'undefined' && 
    document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
  
  const handleError = (e) => {
    setError(true);
    if (onError) onError(e);
  };
  
  const src = (!error && supportsWebP && webpSrc) ? webpSrc : fallbackSrc;
  
  return (
    <img 
      src={src}
      alt={alt}
      style={style}
      className={className}
      onLoad={onLoad}
      onError={handleError}
      loading="lazy"
    />
  );
}

/**
 * Picture element approach - more reliable but slightly more verbose
 */
export function PictureImage({ webpSrc, fallbackSrc, alt, style, className, onLoad, onError }) {
  return (
    <picture>
      {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
      <img 
        src={fallbackSrc}
        alt={alt}
        style={style}
        className={className}
        onLoad={onLoad}
        onError={onError}
        loading="lazy"
      />
    </picture>
  );
}

export default OptimizedImage;

