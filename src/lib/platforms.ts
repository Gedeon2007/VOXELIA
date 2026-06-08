import { Smartphone, Monitor, Apple, Cpu, type LucideIcon } from "lucide-react";

export type Platform = "android" | "ios" | "windows" | "mac";

export interface PlatformConfig {
  id: Platform;
  label: string;
  ext: string;
  icon: LucideIcon;
  /** External destination after the ad/timer flow. */
  downloadUrl: string;
  /** Approximate displayed file size. */
  fileSize: string;
}

export const APP_VERSION = "2.617";
export const APP_SLUG = "voxelia";

export const PLATFORMS: PlatformConfig[] = [
  {
    id: "android",
    label: "Android",
    ext: "APK",
    icon: Smartphone,
    downloadUrl: "https://www.malavida.com/en/android/",
    fileSize: "48.2 MB",
  },
  {
    id: "ios",
    label: "iOS",
    ext: "IPA",
    icon: Apple,
    downloadUrl: "https://www.malavida.com/en/iphone/",
    fileSize: "52.1 MB",
  },
  {
    id: "windows",
    label: "Windows",
    ext: "EXE",
    icon: Monitor,
    downloadUrl: "https://www.malavida.com/en/",
    fileSize: "63.4 MB",
  },
  {
    id: "mac",
    label: "macOS",
    ext: "DMG",
    icon: Cpu,
    downloadUrl: "https://www.malavida.com/en/mac/",
    fileSize: "61.8 MB",
  },
];

export function getPlatform(id: Platform): PlatformConfig {
  return PLATFORMS.find((p) => p.id === id) ?? PLATFORMS[2];
}

export function getFileName(id: Platform): string {
  const p = getPlatform(id);
  return `${APP_SLUG}-${id}-v${APP_VERSION}.${p.ext.toLowerCase()}`;
}

export function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "windows";
  const ua = navigator.userAgent.toLowerCase();
  if (/android/.test(ua)) return "android";
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  if (/mac/.test(ua)) return "mac";
  return "windows";
}