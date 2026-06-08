import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Download, Key, Shield, Zap, Smartphone, Monitor, Apple, MessagesSquare, CheckCircle2, Loader2, Cpu, Lock } from "lucide-react";
import {
  PLATFORMS,
  APP_VERSION,
  detectPlatform,
  getFileName,
  getPlatform,
  type Platform,
} from "@/lib/platforms";
import { AdSlot, type AdStatus } from "@/components/AdSlot";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VOXELIA — Roblox Script Executor for Android, iOS & PC" },
      { name: "description", content: "VOXELIA: free Roblox script executor. Download the latest APK, IPA or EXE. Fast, undetected and updated for the newest Roblox version." },
      { property: "og:title", content: "VOXELIA — #1 Roblox Executor" },
      { property: "og:description", content: "Download VOXELIA for Android, iOS, Windows or Mac. Free, regularly updated and packed with scripts." },
    ],
  }),
  component: Index,
});

const platforms = PLATFORMS;

/**
 * Plug your real ad network here. Throw or return without rendering anything
 * within the slot's `timeoutMs` and the AdSlot will mark itself "failed" —
 * the parent countdown keeps running so the redirect stays smooth.
 *
 * Example (Google AdSense):
 *   const ins = document.createElement("ins");
 *   ins.className = "adsbygoogle";
 *   ins.style.display = "block";
 *   ins.dataset.adClient = "ca-pub-XXXXXXXX";
 *   ins.dataset.adSlot = "1234567890";
 *   container.appendChild(ins);
 *   (window.adsbygoogle = window.adsbygoogle || []).push({});
 */
const injectAd: ((container: HTMLDivElement) => void | (() => void)) | undefined = undefined;

function Index() {
  const [detected, setDetected] = useState<Platform>("windows");
  const [selected, setSelected] = useState<Platform>("windows");
  const [keyStep, setKeyStep] = useState<"idle" | "loading" | "ready">("idle");
  const [generatedKey, setGeneratedKey] = useState("");
  const [copied, setCopied] = useState(false);
  const [downloadModal, setDownloadModal] = useState<null | Platform>(null);
  const [countdown, setCountdown] = useState(15);
  const [adStatus, setAdStatus] = useState<AdStatus>("loading");

  useEffect(() => {
    const p = detectPlatform();
    setDetected(p);
    setSelected(p);
  }, []);

  useEffect(() => {
    if (downloadModal === null) return;
    setCountdown(15);
    setAdStatus("loading");
    const id = setInterval(() => {
      setCountdown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [downloadModal]);

  const handleAdStatus = useCallback((s: AdStatus) => setAdStatus(s), []);

  const openDownload = (p: Platform) => {
    setSelected(p);
    setDownloadModal(p);
    if (keyStep === "idle") startKeySystem();
  };

  const finishDownload = () => {
    if (!downloadModal) return;
    window.open(getPlatform(downloadModal).downloadUrl, "_blank", "noopener,noreferrer");
    setDownloadModal(null);
  };

  const startKeySystem = () => {
    setKeyStep("loading");
    setTimeout(() => {
      const k = "VOXELIA-" + Math.random().toString(36).slice(2, 7).toUpperCase() + "-" + Math.random().toString(36).slice(2, 7).toUpperCase();
      setGeneratedKey(k);
      setKeyStep("ready");
    }, 2200);
  };

  const copyKey = () => {
    navigator.clipboard?.writeText(generatedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const current = platforms.find((p) => p.id === selected)!;

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="VOXELIA" className="w-9 h-9 rounded-lg object-cover" />
            <span className="font-bold text-lg tracking-tight">VOXELIA</span>
          </div>
          <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <a href="#download" className="hover:text-foreground transition">Download</a>
            <a href="#key" className="hover:text-foreground transition">Key System</a>
            <a href="#guide" className="hover:text-foreground transition">Guide</a>
            <a href="#features" className="hover:text-foreground transition">Features</a>
          </nav>
          <a href="#download" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition">Get VOXELIA</a>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-5 pt-16 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border text-xs font-medium text-muted-foreground mb-6">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          v{APP_VERSION} — Updated for latest Roblox
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6">
          The #1 <span className="gradient-text">Roblox Executor</span><br />for every device.
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
          VOXELIA runs your favorite scripts on Android, iOS, Windows and Mac. Lightning fast, regularly updated and packed with a built-in script hub.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
          <button onClick={() => openDownload(detected)} className="glow-pulse inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-base hover:scale-105 transition">
            <Download className="w-5 h-5" /> Download for {platforms.find(p => p.id === detected)?.label}
          </button>
          <a href="#key" className="inline-flex items-center gap-2 px-7 py-4 rounded-xl border border-border bg-card font-semibold hover:bg-secondary transition">
            <Key className="w-5 h-5" /> Get Your Key
          </a>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-accent" /> Safe & Undetected</span>
          <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-accent" /> 99% Script Support</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-accent" /> 12M+ Downloads</span>
        </div>
      </section>

      {/* Download */}
      <section id="download" className="max-w-6xl mx-auto px-5 py-16">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-black mb-3">Download <span className="gradient-text">VOXELIA</span></h2>
          <p className="text-muted-foreground">We detected you're on <strong className="text-foreground">{platforms.find(p => p.id === detected)?.label}</strong>. Pick your platform below.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {platforms.map((p) => {
            const Icon = p.icon;
            const active = selected === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelected(p.id)}
                className={`p-5 rounded-2xl border transition text-left ${active ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-secondary"}`}
              >
                <Icon className={`w-7 h-7 mb-3 ${active ? "text-primary" : "text-muted-foreground"}`} />
                <div className="font-bold">{p.label}</div>
                <div className="text-xs text-muted-foreground">.{p.ext.toLowerCase()}</div>
              </button>
            );
          })}
        </div>

        <div className="rounded-3xl border border-border bg-card p-8 md:p-10 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground mb-3">
            <Lock className="w-3 h-3" /> {getFileName(selected)} · {current.fileSize}
          </div>
          <h3 className="text-2xl font-bold mb-2">VOXELIA for {current.label}</h3>
          <p className="text-muted-foreground mb-6 text-sm">A key is required before launching. Generate yours below after downloading.</p>
          <button onClick={() => openDownload(selected)} className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold hover:scale-105 transition">
            <Download className="w-5 h-5" /> Download {current.ext}
          </button>
        </div>
      </section>

      {/* Key system */}
      <section id="key" className="max-w-4xl mx-auto px-5 py-16">
        <div className="text-center mb-10">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-primary/15 items-center justify-center mb-4 float-anim">
            <Key className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-3">Key <span className="gradient-text">System</span></h2>
          <p className="text-muted-foreground">Generate a free 24-hour access key to unlock VOXELIA.</p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-8 md:p-10">
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {[
              { n: 1, t: "Click Generate", d: "Start the secure key flow." },
              { n: 2, t: "Complete checkpoints", d: "Quick steps to verify you're human." },
              { n: 3, t: "Copy your key", d: "Paste it into the executor." },
            ].map((s) => (
              <div key={s.n} className="p-4 rounded-xl bg-secondary border border-border">
                <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground font-bold flex items-center justify-center mb-2">{s.n}</div>
                <div className="font-semibold mb-1">{s.t}</div>
                <div className="text-xs text-muted-foreground">{s.d}</div>
              </div>
            ))}
          </div>

          {keyStep === "idle" && (
            <button onClick={startKeySystem} className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition flex items-center justify-center gap-2">
              <Key className="w-5 h-5" /> Generate Key
            </button>
          )}
          {keyStep === "loading" && (
            <div className="py-4 flex items-center justify-center gap-3 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" /> Passing checkpoints…
            </div>
          )}
          {keyStep === "ready" && (
            <div className="space-y-3">
              <div className="p-5 rounded-xl bg-background border border-primary/40 font-mono text-center text-lg tracking-widest break-all">
                {generatedKey}
              </div>
              <button onClick={copyKey} className="w-full py-3 rounded-xl bg-accent text-accent-foreground font-semibold hover:opacity-90 transition">
                {copied ? "Copied!" : "Copy Key"}
              </button>
              <p className="text-xs text-center text-muted-foreground">Key valid for 24h · Demo only</p>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-5 py-16">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-12">Why <span className="gradient-text">VOXELIA</span></h2>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { i: Zap, t: "Blazing Fast", d: "Optimized injection in under 2 seconds on most devices." },
            { i: Shield, t: "Stay Safe", d: "Built-in anti-detection keeps your account low-profile." },
            { i: Cpu, t: "Built-in Script Hub", d: "Hundreds of curated scripts ready in one tap." },
            { i: Smartphone, t: "Cross-Platform", d: "Android, iOS, Windows, Mac — same experience." },
            { i: CheckCircle2, t: "Always Updated", d: "Patched within hours of every Roblox update." },
            { i: Key, t: "Free Access", d: "Generate a fresh key whenever you need it." },
          ].map((f) => {
            const Icon = f.i;
            return (
              <div key={f.t} className="p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition">
                <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-1">{f.t}</h3>
                <p className="text-sm text-muted-foreground">{f.d}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Guide */}
      <section id="guide" className="max-w-4xl mx-auto px-5 py-16">
        <h2 className="text-4xl md:text-5xl font-black text-center mb-12">Install <span className="gradient-text">Guide</span></h2>
        <ol className="space-y-4">
          {[
            "Download the file matching your device above.",
            "On Android / iOS, allow installs from unknown sources if prompted.",
            "Open the installer and follow the on-screen steps.",
            "Launch VOXELIA, paste your generated key, and start executing.",
          ].map((step, i) => (
            <li key={i} className="flex gap-4 p-5 rounded-xl border border-border bg-card">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold flex items-center justify-center shrink-0">{i + 1}</div>
              <p className="pt-1.5">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Community */}
      <section className="max-w-4xl mx-auto px-5 py-16">
        <div className="rounded-3xl border border-border bg-gradient-to-br from-primary/15 to-accent/10 p-10 text-center">
          <MessagesSquare className="w-10 h-10 mx-auto mb-4 text-primary" />
          <h2 className="text-3xl md:text-4xl font-black mb-3">Join the Community</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">Get scripts, support and update alerts from 200k+ VOXELIA users on Discord.</p>
          <a href="#" className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:scale-105 transition">
            <MessagesSquare className="w-4 h-4" /> Open Discord
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-10">
        <div className="max-w-6xl mx-auto px-5 py-8 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="VOXELIA" className="w-7 h-7 rounded-md object-cover" />
            <span>© 2026 VOXELIA — Demo site</span>
          </div>
          <div className="flex gap-5">
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">DMCA</a>
          </div>
        </div>
      </footer>

      {/* Download intermediate modal */}
      {downloadModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-3xl max-w-lg w-full p-6 md:p-8 relative my-8">
            <button
              onClick={() => setDownloadModal(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary text-muted-foreground hover:text-foreground flex items-center justify-center"
              aria-label="Close"
            >
              ✕
            </button>

            <div className="text-center mb-5">
              <div className="inline-flex w-14 h-14 rounded-2xl bg-primary/15 items-center justify-center mb-3">
                <Download className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-black mb-1">
                Preparing VOXELIA for {getPlatform(downloadModal).label}
              </h3>
              <p className="text-sm text-muted-foreground">
                File: {getFileName(downloadModal)} · {getPlatform(downloadModal).fileSize}
              </p>
            </div>

            <AdSlot
              slotId={`ad-download-${downloadModal}`}
              inject={injectAd}
              onStatusChange={handleAdStatus}
              timeoutMs={4000}
              className="mb-5"
            />
            {adStatus === "failed" && (
              <p className="text-[10px] text-center text-muted-foreground -mt-3 mb-3">
                Ad couldn't load — your download will continue anyway.
              </p>
            )}

            {/* Key system summary */}
            <div className="rounded-xl bg-secondary/60 border border-border p-4 mb-5">
              <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                <Key className="w-4 h-4 text-primary" /> Your access key
              </div>
              {keyStep === "ready" ? (
                <div className="font-mono text-sm text-center tracking-wider break-all bg-background border border-primary/40 rounded-lg p-3">
                  {generatedKey}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" /> Generating your 24h key…
                </div>
              )}
            </div>

            {/* Timer + CTA */}
            {countdown > 0 || keyStep !== "ready" ? (
              <div className="text-center">
                <div className="text-5xl font-black gradient-text mb-2">
                  {Math.max(countdown, 0)}s
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  Please wait while we verify your download and load the ad…
                </p>
                <button
                  disabled
                  className="w-full py-4 rounded-xl bg-primary/40 text-primary-foreground font-bold cursor-not-allowed"
                >
                  Please wait…
                </button>
              </div>
            ) : (
              <button
                onClick={finishDownload}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold hover:scale-[1.02] transition flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" /> Continue to download
              </button>
            )}

            <p className="text-[10px] text-center text-muted-foreground mt-3">
              You will be redirected to malavida.com to finalize the download.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
