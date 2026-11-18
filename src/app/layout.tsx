// Pass-through root layout: [locale]/layout.tsx and admin/layout.tsx render <html>.
// Needed so the top-level not-found.tsx has a root layout (next-intl pattern).
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
