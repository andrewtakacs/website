import React from 'react';
import styles from './ResponsiveImage.module.css';

const ResponsiveImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  placeholder = 'blur',
  ...props
}) => {
  // Generate responsive image sources
  const generateSrcSet = (baseSrc, format = 'webp') => {
    const baseName = baseSrc.replace(/\.[^/.]+$/, '');
    const sizes = [400, 800, 1200, 1600, 2000];
    
    return sizes
      .map(size => `${baseName}-${size}w.${format} ${size}w`)
      .join(', ');
  };

  const generateSizes = () => {
    return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
  };

  // Generate blur placeholder
  const generateBlurDataURL = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 8;
    canvas.height = 8;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, 8, 8);
    return canvas.toDataURL();
  };

  return (
    <div className={`${styles.imageContainer} ${className}`} {...props}>
      <picture>
        {/* AVIF format for modern browsers */}
        <source
          srcSet={generateSrcSet(src, 'avif')}
          sizes={generateSizes()}
          type="image/avif"
        />
        {/* WebP format for good browser support */}
        <source
          srcSet={generateSrcSet(src, 'webp')}
          sizes={generateSizes()}
          type="image/webp"
        />
        {/* Fallback to original format */}
        <img
          src={src}
          srcSet={generateSrcSet(src, 'jpg')}
          sizes={generateSizes()}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className={styles.image}
          style={{
            aspectRatio: width && height ? `${width}/${height}` : 'auto'
          }}
        />
      </picture>
    </div>
  );
};

export default ResponsiveImage;
