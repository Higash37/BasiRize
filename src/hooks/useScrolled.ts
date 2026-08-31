import { useEffect, useState } from "react";

// .site-scroll-area が少しでもスクロールされたらtrueを返す
export function useScrolled(): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const scrollArea = document.querySelector(".site-scroll-area");
    if (!scrollArea) {
      return;
    }

    const onScroll = () => setScrolled(scrollArea.scrollTop > 0);
    onScroll();
    scrollArea.addEventListener("scroll", onScroll, { passive: true });

    return () => scrollArea.removeEventListener("scroll", onScroll);
  }, []);

  return scrolled;
}
