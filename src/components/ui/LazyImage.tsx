import React from "react";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
}

export default function LazyImage({
  src,
  alt,
  className,
  aspectRatio,
}: LazyImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
      style={aspectRatio ? { aspectRatio } : undefined}
    />
  );
}
