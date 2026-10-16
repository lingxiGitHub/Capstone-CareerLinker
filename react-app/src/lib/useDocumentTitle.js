import { useEffect } from "react";

export default function useDocumentTitle(title, count = 0) {
  useEffect(() => {
    const base = title ? `${title} | CareerLinker` : "CareerLinker";
    document.title = count > 0 ? `(${count}) ${base}` : base;
  }, [title, count]);
}
