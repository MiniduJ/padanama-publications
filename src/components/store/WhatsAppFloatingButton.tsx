import React from "react";
import { MessageCircle } from "lucide-react";

export function WhatsAppFloatingButton() {
  return (
    <a
      href="https://wa.me/94718008533?text=Hello%20Padanama%20Publications,%20I%20would%20like%20to%20inquire%20about%20a%20book."
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Padanama on WhatsApp"
      className="fixed bottom-20 md:bottom-6 right-5 z-40 p-3.5 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center border-2 border-white ring-4 ring-green-600/20"
    >
      <MessageCircle className="w-6 h-6 stroke-[2.2]" />
    </a>
  );
}
