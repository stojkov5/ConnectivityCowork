import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

function findScrollableParent() {
  // Most common candidates in apps like yours
  const candidates = [
    document.querySelector("main"),
    document.querySelector("#root"),
    document.scrollingElement,
    document.documentElement,
    document.body,
  ].filter(Boolean);

  // Prefer an element that can actually scroll
  for (const el of candidates) {
    const style = window.getComputedStyle(el);
    const overflowY = style.overflowY;
    const canScroll =
      (overflowY === "auto" || overflowY === "scroll") &&
      el.scrollHeight > el.clientHeight;

    if (canScroll) return el;
  }

  // Fallback
  return document.scrollingElement || document.documentElement || document.body;
}

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    // If it's a hash navigation, let HashLink / browser handle the target.
    if (hash) return;

    // Scroll BOTH: window + scroll container (whichever is actually used)
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    const scroller = findScrollableParent();
    if (scroller && typeof scroller.scrollTo === "function") {
      scroller.scrollTo({ top: 0, left: 0, behavior: "auto" });
    } else if (scroller) {
      scroller.scrollTop = 0;
    }
  }, [pathname, hash]);

  return null;
}
