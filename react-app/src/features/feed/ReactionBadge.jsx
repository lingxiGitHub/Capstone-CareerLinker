import { REACTION_BY_TYPE } from "../../lib/reactions";

/** Small colored circle with a reaction emoji, as shown in LinkedIn's counts row. */
export default function ReactionBadge({ type, size = 16 }) {
  const r = REACTION_BY_TYPE[type];
  if (!r) return null;
  return (
    <span className="rx-badge" style={{ width: size, height: size, background: r.color, fontSize: size * 0.6 }} title={r.label}>
      {r.emoji}
    </span>
  );
}
