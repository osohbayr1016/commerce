"use client";

import dynamic from "next/dynamic";

const ClientCartDrawer = dynamic(
  () => import("@/components/Cart/ClientCartDrawer"),
  { ssr: false },
);

export default function CartDrawerDynamic() {
  return <ClientCartDrawer />;
}
