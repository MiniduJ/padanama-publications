import React from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { ContactForm } from "@/components/store/ContactForm";

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="border-b border-maroon-100 pb-6">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-maroon-900 tracking-tight">
          සම්බන්ධ වන්න (Contact Us)
        </h1>
        <p className="text-sm text-ink-muted mt-1">
          පොත් ඇණවුම්, බෙදාහැරීම් විමසීම් හෝ ප්‍රකාශන සහය සඳහා ඕනෑම මොහොතක අප අමතන්න.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 bg-white rounded-2xl border border-maroon-100 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-maroon-900">ප්‍රධාන කාර්යාලය සහ ගබඩාව</h3>

            <div className="space-y-4 text-xs sm:text-sm text-ink">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-saffron-500 shrink-0 mt-0.5" />
                <span>නො. 912/A, බෝගහ හන්දිය පාර, ගෝඨාභය, කොලොන්නාව, ශ්‍රී ලංකාව.</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-saffron-500 shrink-0" />
                <span>+94 71 800 8533 / +94 77 088 2228</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-saffron-500 shrink-0" />
                <span>hello@padanamapublication.lk / info@padanamapublication.lk</span>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-saffron-500 shrink-0" />
                <span>සඳුදා – සෙනසුරාදා: පෙ.ව. 8.30 – ප.ව. 6.00</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <a
                href="https://wa.me/94718008533"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-xs shadow flex items-center justify-center gap-2 transition-colors"
              >
                <WhatsAppIcon className="w-4 h-4 fill-current" />
                <span>WhatsApp මඟින් සම්බන්ධ වන්න (+94 71 800 8533)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-maroon-100 shadow-sm space-y-6">
          <h2 className="font-display font-bold text-xl text-maroon-900">
            පණිවිඩයක් යොමු කරන්න (Send an Inquiry)
          </h2>

          <ContactForm />
        </div>
      </div>
    </div>
  );
}
