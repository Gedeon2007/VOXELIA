import { useEffect, useRef, useState } from "react";

export type AdStatus = "loading" | "loaded" | "failed";

interface AdSlotProps {
  /** Unique id, useful when a provider needs a container id. */
  slotId: string;
  /** Max time to wait for the ad to render before declaring it failed (ms). */
  timeoutMs?: number;
  /** Called whenever the ad state changes — lets the parent keep the flow smooth. */
  onStatusChange?: (status: AdStatus) => void;
  /**
   * Optional function that injects your ad network code into the container.
   * Return a cleanup function. If it throws, the slot falls back gracefully.
   *
   * Examples:
   *  - AdSense: push an ad inside the container then return () => {}
   *  - Adsterra / PropellerAds: append their <script> tag to the container
   */
  inject?: (container: HTMLDivElement) => void | (() => void);
  className?: string;
}

/**
 * Ad container with built-in fallback:
 *  - If `inject` is not provided, shows a placeholder and immediately reports "failed"
 *    so the parent flow (timer, redirect) is never blocked.
 *  - If `inject` throws or no DOM is rendered before `timeoutMs`, status becomes "failed".
 *  - If the container receives child nodes, status becomes "loaded".
 */
export function AdSlot({
  slotId,
  timeoutMs = 4000,
  onStatusChange,
  inject,
  className = "",
}: AdSlotProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<AdStatus>("loading");

  useEffect(() => {
    onStatusChange?.(status);
  }, [status, onStatusChange]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // No provider wired in — render the placeholder, mark as failed so the
    // download flow continues without waiting on a real ad network.
    if (!inject) {
      setStatus("failed");
      return;
    }

    let cleanup: void | (() => void);
    let cancelled = false;

    try {
      cleanup = inject(el);
    } catch (err) {
      console.warn("[AdSlot] inject failed:", err);
      setStatus("failed");
      return;
    }

    const observer = new MutationObserver(() => {
      if (!cancelled && el.childNodes.length > 0) {
        setStatus("loaded");
      }
    });
    observer.observe(el, { childList: true, subtree: true });

    const timer = window.setTimeout(() => {
      if (!cancelled && el.childNodes.length === 0) {
        setStatus("failed");
      }
    }, timeoutMs);

    return () => {
      cancelled = true;
      observer.disconnect();
      window.clearTimeout(timer);
      try {
        cleanup?.();
      } catch (err) {
        console.warn("[AdSlot] cleanup failed:", err);
      }
    };
  }, [inject, timeoutMs]);

  return (
    <div className={className}>
      <div
        id={slotId}
        ref={ref}
        className="min-h-[120px] rounded-xl border border-dashed border-border bg-secondary/40 flex items-center justify-center text-center text-xs text-muted-foreground p-4"
      >
        {status === "loading" && <span>Loading ad…</span>}
        {status === "failed" && (
          <span>
            <span className="block font-semibold text-foreground mb-1">
              [ AD SLOT — fallback ]
            </span>
            Plug your ad network (AdSense, Adsterra, PropellerAds…) via the
            <code className="mx-1 px-1 rounded bg-background">inject</code>
            prop. The download flow continues either way.
          </span>
        )}
      </div>
    </div>
  );
}