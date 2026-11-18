import React from "react";
import { Building2, FileSpreadsheet, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function WholesalePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10 text-left">
      <div className="space-y-3 border-b border-maroon-100 pb-6">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-maroon-900 tracking-tight flex items-center gap-3">
          <Building2 className="w-8 h-8 text-saffron-500" />
          <span>තොග සහ ආයතනික ඇණවුම් (Wholesale & Institutional)</span>
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted">
          පාසල් පුස්තකාල, අධ්‍යාපන ආයතන, උපකාරක පන්ති සහ පොත්හල් හිමියන් සඳහා විශේෂ තොග වට්ටම් (25%–35%) සහ නිල මිල ගණන් කැඳවීම් (Pro-Forma Invoices).
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-maroon-100 shadow-sm space-y-1">
          <CheckCircle2 className="w-5 h-5 text-green-700" />
          <h4 className="font-bold text-xs text-ink">විශේෂ වෙළඳ වට්ටම්</h4>
          <p className="text-[11px] text-ink-muted">පිටපත් 20ට වැඩි තොග ඇණවුම් සඳහා 25% සිට 35% දක්වා වට්ටම්.</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-maroon-100 shadow-sm space-y-1">
          <FileSpreadsheet className="w-5 h-5 text-saffron-600" />
          <h4 className="font-bold text-xs text-ink">නිල රාජ්‍ය බිල්පත්</h4>
          <p className="text-[11px] text-ink-muted">රාජ්‍ය පාසල් සහ ආයතන සඳහා මුද්‍රිත නිල ලදුපත් සහ වවුචර් සහය.</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-maroon-100 shadow-sm space-y-1">
          <Building2 className="w-5 h-5 text-maroon-700" />
          <h4 className="font-bold text-xs text-ink">කඩිනම් ප්‍රවාහනය</h4>
          <p className="text-[11px] text-ink-muted">බර පාර්සල් සඳහා විශේෂ භාණ්ඩ ප්‍රවාහන කුරියර් පහසුකම්.</p>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-maroon-100 shadow-sm space-y-6">
        <h3 className="font-bold text-base text-maroon-900">තොග මිල ගණන් ඉල්ලුම් පත්‍රය (Request a Quotation)</h3>

        <form className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="ආයතනයේ / පොත්හලේ නම (Institution / Store Name)" placeholder="ධර්මරාජ විද්‍යාලයීය පුස්තකාලය" required />
            <Input label="සම්බන්ධීකාරකගේ නම (Contact Person)" placeholder="පී. කේ. ජයවර්ධන මහතා" required />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="දුරකථන අංකය (Phone Number)" placeholder="077 123 4567" required />
            <Input label="විද්‍යුත් තැපෑල (Email Address)" type="email" placeholder="library@school.lk" required />
          </div>

          <Input label="නගරය සහ දිස්ත්‍රික්කය (City & District)" placeholder="මහනුවර (Kandy)" required />

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-ink">අවශ්‍ය පොත් සහ ප්‍රමාණ පිළිබඳ විස්තරය (Required Books & Quantities)</label>
            <textarea
              rows={4}
              placeholder="උදා: 5 ශ්‍රේණිය ශිෂ්‍යත්ව ප්‍රශ්න පත්‍ර (පිටපත් 50), සා.පෙළ ගණිතය (පිටපත් 30)..."
              className="w-full p-3 bg-white border border-maroon-200 rounded-xl text-sm text-ink focus:outline-none focus:ring-2 focus:ring-saffron-500"
              required
            />
          </div>

          <Button variant="saffron">
            <span>මිල ගණන් ඉල්ලුම් කරන්න (Submit Request)</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
