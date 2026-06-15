"use client";

import { useMemo } from 'react';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';

export default function HeroRiveAnimation() {
  const layout = useMemo(() => new Layout({
    fit: Fit.FitWidth,
    alignment: Alignment.BottomCenter,
  }), []);

  const { RiveComponent } = useRive({
    src: '/hero-home.riv',
    stateMachines: 'state_home-hero',
    autoplay: true,
    layout: layout,
  });

  return (
    <div className="absolute inset-x-0 bottom-0 w-full pointer-events-none">
      <div className="relative w-full pt-[40%]">
        <RiveComponent className="absolute top-0 left-0 w-full h-full" />
      </div>
    </div>
  );
}
