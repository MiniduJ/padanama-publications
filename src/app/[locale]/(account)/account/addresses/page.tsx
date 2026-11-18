import React from "react";
import { MapPin, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AccountAddressesPage() {
  const addresses = [
    {
      id: "addr-1",
      recipientName: "දිල්රුක්ෂි ජයවර්ධන",
      phone: "077 123 4567",
      addressLine1: "නො. 45/2, සමගි මාවත",
      addressLine2: "කැලණිය",
      landmark: "කැලණි රජමහා විහාරය අසල",
      city: "කැලණිය (Kelaniya)",
      district: "ගම්පහ (Gampaha)",
      province: "බස්නාහිර පළාත (Western)",
      isDefault: true,
    },
  ];

  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-maroon-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-maroon-900">
            ලිපින පොත (Saved Addresses)
          </h1>
          <p className="text-xs text-ink-muted mt-1">
            දිවයින පුරා කුරියර් බෙදාහැරීම් සඳහා ඔබගේ ලිපින මෙතැනින් කළමනාකරණය කරන්න.
          </p>
        </div>
        <Button variant="saffron" size="sm">
          <Plus className="w-4 h-4 mr-1.5" />
          <span>නව ලිපිනයක් එක් කරන්න</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className="p-6 bg-white rounded-3xl border-2 border-maroon-500 shadow-sm space-y-3 relative text-xs text-ink"
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <span className="font-bold text-sm text-maroon-900">{addr.recipientName}</span>
              {addr.isDefault && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800 flex items-center gap-1">
                  <Check className="w-3 h-3" /> ප්‍රධාන ලිපිනය
                </span>
              )}
            </div>

            <div className="space-y-1 text-ink-muted">
              <p>{addr.addressLine1}</p>
              <p>{addr.addressLine2}</p>
              <p className="text-maroon-800 font-medium">සලකුණ (Landmark): {addr.landmark}</p>
              <p className="font-bold text-ink">{addr.city}, {addr.district}</p>
              <p>{addr.province}</p>
              <p className="pt-1 font-semibold text-ink">දුරකථන: {addr.phone}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
