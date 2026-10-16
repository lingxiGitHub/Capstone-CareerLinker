import { LogoMark } from "./Logo";
import "./RailFooter.css";

const LINKS = ["About", "Accessibility", "Help Center", "Privacy & Terms", "Ad Choices", "Advertising", "Business Services", "Get the app", "More"];

export default function RailFooter() {
  return (
    <footer className="rail-footer">
      <ul>
        {LINKS.map((l) => (
          <li key={l}>
            <span>{l}</span>
          </li>
        ))}
      </ul>
      <p className="rail-copy">
        <LogoMark size={14} /> <span className="bold">CareerLinker</span> Corporation © {new Date().getFullYear()}
      </p>
    </footer>
  );
}
