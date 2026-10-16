import Button from "../components/Button";
import useDocumentTitle from "../lib/useDocumentTitle";

export default function NotFound() {
  useDocumentTitle("Page not found");
  return (
    <main className="page" style={{ textAlign: "center", paddingTop: 80 }}>
      <svg width="240" height="160" viewBox="0 0 240 160" aria-hidden="true" style={{ margin: "0 auto 24px" }}>
        <rect x="20" y="30" width="200" height="110" rx="10" fill="#e9e5df" />
        <rect x="40" y="52" width="70" height="66" rx="6" fill="#d0e8ff" />
        <rect x="124" y="56" width="76" height="10" rx="5" fill="#c9c4bc" />
        <rect x="124" y="76" width="56" height="10" rx="5" fill="#c9c4bc" />
        <rect x="124" y="96" width="66" height="10" rx="5" fill="#c9c4bc" />
        <circle cx="75" cy="78" r="14" fill="#0a66c2" opacity=".35" />
        <path d="M52 112c6-14 40-14 46 0" stroke="#0a66c2" strokeWidth="6" fill="none" opacity=".35" strokeLinecap="round" />
      </svg>
      <h1 style={{ fontSize: 24, fontWeight: 400, marginBottom: 8 }}>This page doesn't exist</h1>
      <p className="muted" style={{ marginBottom: 24 }}>
        Please check your URL or return to your feed.
      </p>
      <Button variant="secondary" to="/feed">
        Go to your feed
      </Button>
    </main>
  );
}
