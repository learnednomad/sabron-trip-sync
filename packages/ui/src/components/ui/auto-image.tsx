import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const autoImageVariants = cva(
  'block',
  {
    variants: {
      preset: {
        default: 'object-cover',
        contain: 'object-contain',
        cover: 'object-cover',
        fill: 'object-fill',
        none: 'object-none',
        'scale-down': 'object-scale-down',
      },
      aspectRatio: {
        square: 'aspect-square',
        video: 'aspect-video',
        '3/4': 'aspect-[3/4]',
        '4/3': 'aspect-[4/3]',
        '16/9': 'aspect-[16/9]',
        '21/9': 'aspect-[21/9]',
      },
      size: {
        xs: 'w-16 h-16',
        sm: 'w-24 h-24',
        md: 'w-32 h-32',
        lg: 'w-48 h-48',
        xl: 'w-64 h-64',
        '2xl': 'w-80 h-80',
        full: 'w-full h-auto',
      },
    },
    defaultVariants: {
      preset: 'cover',
      size: 'full',
    },
  }
);

export interface AutoImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement>,
    VariantProps<typeof autoImageVariants> {
  fallback?: string;
  onError?: () => void;
}

const AutoImage = React.forwardRef<HTMLImageElement, AutoImageProps>(
  ({ 
    className, 
    preset, 
    aspectRatio, 
    size, 
    src, 
    alt = '', 
    fallback,
    onError,
    ...props 
  }, ref) => {
    const [imageSrc, setImageSrc] = React.useState(src);
    const [imageError, setImageError] = React.useState(false);

    React.useEffect(() => {
      setImageSrc(src);
      setImageError(false);
    }, [src]);

    const handleError = () => {
      if (!imageError && fallback) {
        setImageSrc(fallback);
        setImageError(true);
      }
      onError?.();
    };

    return (
      <img
        ref={ref}
        src={imageSrc}
        alt={alt}
        className={cn(autoImageVariants({ preset, aspectRatio, size, className }))}
        onError={handleError}
        {...props}
      />
    );
  }
);

AutoImage.displayName = 'AutoImage';

export { AutoImage, autoImageVariants };