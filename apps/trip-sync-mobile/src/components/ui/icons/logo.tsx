import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Circle, G, Path } from 'react-native-svg';

export function Logo({ color = '#000', ...props }: SvgProps) {
  return (
    <Svg width={100} height={100} viewBox="0 0 100 100" fill="none" {...props}>
      <G>
        {/* Airplane icon simplified */}
        <Path
          d="M50 20 L30 45 L50 40 L70 45 Z"
          fill={color}
          fillOpacity={0.9}
        />
        <Path
          d="M50 40 L45 65 L50 60 L55 65 Z"
          fill={color}
          fillOpacity={0.8}
        />
        {/* Globe circle */}
        <Circle
          cx="50"
          cy="50"
          r="35"
          stroke={color}
          strokeWidth="3"
          fill="none"
          strokeOpacity={0.3}
        />
        <Path
          d="M15 50 Q50 30 85 50"
          stroke={color}
          strokeWidth="2"
          fill="none"
          strokeOpacity={0.2}
        />
        <Path
          d="M15 50 Q50 70 85 50"
          stroke={color}
          strokeWidth="2"
          fill="none"
          strokeOpacity={0.2}
        />
      </G>
    </Svg>
  );
}
