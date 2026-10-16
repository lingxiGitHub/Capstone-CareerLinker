import { useEffect, useRef, useState } from "react";

/** Text clamped to N lines with a LinkedIn-style "…see more" toggle (only shown when it overflows). */
export default function SeeMore({ text, lines = 3, className = "" }) {
  const [open, setOpen] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (el && !open) setOverflows(el.scrollHeight > el.clientHeight + 1);
  }, [text, open]);

  if (!text) return null;
  return (
    <div className={`pf-seemore ${className}`}>
      <div ref={ref} className="pf-seemore-text" style={open ? undefined : { WebkitLineClamp: lines }} data-open={open}>
        {text}
      </div>
      {overflows && !open && (
        <button type="button" className="pf-seemore-btn" onClick={() => setOpen(true)}>
          …see more
        </button>
      )}
    </div>
  );
}
