import Link from "next/link";

export default function LocaleNotFound() {
  return (
    <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
      <h1 className="font-display font-black text-3xl sm:text-4xl text-brandNavy">
        404 - පිටුව හමු නොවීය
      </h1>
      <p className="text-sm text-ink-muted">
        ඔබ සොයන පිටුව සොයාගත නොහැක. කරුණාකර නැවත මුල් පිටුවට පිවිසෙන්න.
      </p>
      <Link
        href="/"
        className="inline-block px-5 py-2.5 rounded-xl bg-brandRed text-white font-bold text-xs shadow hover:bg-brandRed-600 transition-colors"
      >
        මුල් පිටුවට යන්න (Return to Home)
      </Link>
    </div>
  );
}
