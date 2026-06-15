"use client";

import { useMemo } from "react";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";

export default function SimpleRiveAnimation({ src, stateMachines }: { src: string; stateMachines?: string }) {
  const layout = useMemo(() => new Layout({
    fit: Fit.Contain,
    alignment: Alignment.Center,
  }), []);

  const { RiveComponent } = useRive({
    src,
    stateMachines,
    autoplay: true,
    layout,
  });

  return <RiveComponent className="w-full h-full" />;
}
