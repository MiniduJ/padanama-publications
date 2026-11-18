import React from "react";
import { StoreHeader } from "@/components/store/StoreHeader";
import { StoreFooter } from "@/components/store/StoreFooter";
import { MobileBottomNav } from "@/components/store/MobileBottomNav";
import { WhatsAppFloatingButton } from "@/components/store/WhatsAppFloatingButton";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <StoreHeader />
      <main className="flex-1">{children}</main>
      <StoreFooter />
      <WhatsAppFloatingButton />
      <MobileBottomNav />
    </div>
  );
}
