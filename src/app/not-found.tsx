import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="si">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "3rem 1rem", textAlign: "center", backgroundColor: "#FFF8EC", color: "#1E1A17" }}>
        <h1 style={{ color: "#0D2240", fontSize: "2rem", fontWeight: 900 }}>
          404 - පිටුව හමු නොවීය (Page Not Found)
        </h1>
        <p style={{ color: "#666", marginTop: "1rem", fontSize: "0.875rem" }}>
          ඔබ සොයන පිටුව ඉවත් කර හෝ වෙනත් ලිපිනයකට මාරු කර ඇත.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-block",
            marginTop: "1.5rem",
            padding: "0.75rem 1.5rem",
            backgroundColor: "#D32F2F",
            color: "#ffffff",
            borderRadius: "0.75rem",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "0.875rem",
          }}
        >
          මුල් පිටුවට යන්න (Go Home)
        </Link>
      </body>
    </html>
  );
}
