import { useEffect, useRef, useState } from "react";

function isNodeInView(node) {
  const rect = node.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  // Keep a small bottom inset so reveals still trigger near the fold on iOS.
  return rect.top < viewportHeight * 0.92 && rect.bottom > 0;
}

function RevealOnScroll({ children, className = "", as: Tag = "div", delay = 0 }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || isVisible) {
      return undefined;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return undefined;
    }

    let cancelled = false;
    let observer;

    const cleanupListeners = () => {
      observer?.disconnect();
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };

    const show = () => {
      if (cancelled) {
        return;
      }
      // Double rAF: paint opacity:0 first so the CSS transition can run on iOS WebKit.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!cancelled) {
            setIsVisible(true);
          }
        });
      });
    };

    const revealIfVisible = () => {
      if (!isNodeInView(node)) {
        return false;
      }
      cleanupListeners();
      show();
      return true;
    };

    function onScroll() {
      revealIfVisible();
    }

    if (revealIfVisible()) {
      return () => {
        cancelled = true;
      };
    }

    // iOS Chrome/Safari (WebKit) can miss IntersectionObserver callbacks during
    // momentum scrolling; pair it with a lightweight scroll fallback.
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          cleanupListeners();
          show();
        }
      },
      { threshold: 0.01, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      cancelled = true;
      cleanupListeners();
    };
  }, [isVisible]);

  return (
    <Tag
      ref={ref}
      className={`reveal-on-scroll${isVisible ? " is-visible" : ""}${className ? ` ${className}` : ""}`}
      style={delay ? { "--reveal-delay": `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

export default RevealOnScroll;
