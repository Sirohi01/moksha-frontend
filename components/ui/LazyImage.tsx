'use client';

import Image from 'next/image';
import { useState } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  sizes?: string;
}

export default function LazyImage({ src, alt, width, height, className, sizes }: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-200 dark:bg-gray-700 ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-400 text-sm">Image not found</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div 
          className={`absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 ${className}`}
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        sizes={sizes || `${width}px`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
}