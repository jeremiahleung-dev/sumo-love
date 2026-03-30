"use client";

import dynamic from "next/dynamic";

const ANIMATION_COMPONENTS: Record<string, React.ComponentType> = {
  push:    dynamic(() => import("@/components/kimarite/animations/PushAnimation"),    { ssr: false }),
  throw:   dynamic(() => import("@/components/kimarite/animations/ThrowAnimation"),   { ssr: false }),
  trip:    dynamic(() => import("@/components/kimarite/animations/TripAnimation"),    { ssr: false }),
  lift:    dynamic(() => import("@/components/kimarite/animations/LiftAnimation"),    { ssr: false }),
  twist:   dynamic(() => import("@/components/kimarite/animations/TwistAnimation"),   { ssr: false }),
  pull:    dynamic(() => import("@/components/kimarite/animations/PushAnimation"),    { ssr: false }),
  special: dynamic(() => import("@/components/kimarite/animations/SpecialAnimation"), { ssr: false }),
};

export default function KimariteAnimation({ animationId }: { animationId: string }) {
  const Animation = ANIMATION_COMPONENTS[animationId] ?? ANIMATION_COMPONENTS["special"];
  return <Animation />;
}
