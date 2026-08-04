"use client";

import { useState, useEffect } from "react";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { FileOpener } from "@capawesome-team/capacitor-file-opener";
import packageJson from "../../package.json";

interface UpdateInfo {
  latest: string;
  show: boolean;
}

const GITHUB_OWNER = "ahmedfathy0-0";
const GITHUB_REPO = "etqaan-frontend-deploy";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api-v1";

/** Compare semver strings. Returns true if v1 < v2 */
function isOlderVersion(v1: string, v2: string): boolean {
  const p1 = v1.split(".").map(Number);
  const p2 = v2.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    if ((p1[i] ?? 0) < (p2[i] ?? 0)) return true;
    if ((p1[i] ?? 0) > (p2[i] ?? 0)) return false;
  }
  return false;
}

function isElectron(): boolean {
  return typeof window !== "undefined" && !!(window as any).etqaanApp;
}

function isAndroid(): boolean {
  return (
    typeof window !== "undefined" &&
    !!(window as any).Capacitor?.isNativePlatform()
  );
}

export default function UpdateManager() {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/app-version`);
        if (!res.ok) return;
        const data = await res.json();

        let platform = "web";
        if (isElectron()) platform = "linux"; // covers both linux and windows builds
        else if (isAndroid()) platform = "android";

        const policy = data.platforms?.[platform];
        if (!policy) return;

        let currentVersion = packageJson.version;
        if (isElectron()) {
          currentVersion = await (window as any).etqaanApp.getAppVersion();
        }

        if (isOlderVersion(currentVersion, policy.latest)) {
          setUpdateInfo({ latest: policy.latest, show: true });
        }
      } catch (err) {
        console.error("Failed to check app version:", err);
      }
    };

    check();

    // Register Electron update listeners
    if (isElectron()) {
      const app = (window as any).etqaanApp;
      app.onUpdateProgress((progressObj: { percent: number }) => {
        setDownloadProgress(Math.round(progressObj.percent));
      });
      app.onUpdateDownloaded(() => {
        setIsDownloading(false);
        setIsDone(true);
        // auto-install after short delay
        setTimeout(() => app.installUpdate(), 1500);
      });
      if (app.onUpdateError) {
        app.onUpdateError((errorMsg: string) => {
          console.error("Updater error:", errorMsg);
          setIsDownloading(false);
          setDownloadProgress(null);
          alert(`فشل التحديث: ${errorMsg}\nيرجى تنزيل الإصدار الجديد يدوياً من GitHub.`);
        });
      }
    }
  }, []);

  const handleUpdate = async () => {
    setIsDownloading(true);
    setDownloadProgress(0);

    if (isElectron()) {
      try {
        const app = (window as any).etqaanApp;
        await app.checkForUpdates();
        app.downloadUpdate();
      } catch {
        setIsDownloading(false);
        alert("فشل بدء التحديث. يرجى تنزيل الإصدار الجديد يدوياً من GitHub.");
      }
      return;
    }

    // Android path — download APK from GitHub Releases
    try {
      const res = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`
      );
      if (!res.ok) throw new Error("Failed to fetch release info");
      const releaseData = await res.json();

      const apkAsset = releaseData.assets?.find((a: any) =>
        a.name.endsWith(".apk")
      );
      if (!apkAsset) throw new Error("APK not found in latest release");

      const progressListener = await Filesystem.addListener(
        "progress",
        (status: { bytes: number; contentLength: number }) => {
          if (status.contentLength > 0) {
            setDownloadProgress(
              Math.round((status.bytes / status.contentLength) * 100)
            );
          }
        }
      );

      const savedFile = await Filesystem.downloadFile({
        url: apkAsset.browser_download_url,
        path: "etqaan-update.apk",
        directory: Directory.Cache,
        progress: true,
      });

      await progressListener.remove();

      let fileUri = savedFile.path;
      if (!fileUri?.startsWith("file://")) {
        const stat = await Filesystem.stat({
          path: "etqaan-update.apk",
          directory: Directory.Cache,
        });
        fileUri = stat.uri;
      }

      setIsDownloading(false);
      setUpdateInfo((prev) => (prev ? { ...prev, show: false } : null));

      await FileOpener.openFile({
        path: fileUri!,
        mimeType: "application/vnd.android.package-archive",
      });
    } catch (err) {
      console.error("Update Failed:", err);
      setIsDownloading(false);
      window.open(
        `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`,
        "_blank"
      );
    }
  };

  if (!updateInfo?.show) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-black/50 backdrop-blur-sm lg:items-center">
      <div
        className="w-full max-w-md rounded-t-[24px] bg-white p-8 shadow-2xl lg:rounded-[24px]"
        dir="rtl"
      >
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-warning-100">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L2 19h20L12 2zm0 3l7.5 13h-15L12 5zm-1 5v4h2v-4h-2zm0 6v2h2v-2h-2z"
                fill="#b45309"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="mb-2 text-center text-2xl font-bold text-success-900 font-cairo">
          تحديث جديد متاح!
        </h2>

        {/* Description */}
        <p className="mb-6 text-center text-neutral-600 font-cairo leading-relaxed">
          الإصدار <span className="font-bold text-success-700">{updateInfo.latest}</span> متاح الآن.
          {isDownloading
            ? " جاري تنزيل التحديث..."
            : " يُنصح بالتحديث للحصول على أحدث الميزات وإصلاحات الأخطاء."}
        </p>

        {/* Progress bar */}
        {isDownloading && downloadProgress !== null && (
          <div className="mb-4">
            <div className="mb-1 flex justify-between text-sm text-neutral-600 font-cairo">
              <span>{downloadProgress}%</span>
              <span>جاري التنزيل...</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-neutral-200">
              <div
                className="h-full rounded-full bg-success-600 transition-all duration-300"
                style={{ width: `${downloadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Done state */}
        {isDone && (
          <p className="mb-4 text-center text-success-700 font-bold font-cairo">
            ✅ تم تنزيل التحديث — سيتم التثبيت الآن...
          </p>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleUpdate}
            disabled={isDownloading || isDone}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-success-800 font-bold text-white font-cairo text-lg hover:bg-success-900 disabled:opacity-60 transition-colors"
          >
            {isDownloading ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                جاري التنزيل {downloadProgress !== null ? `${downloadProgress}%` : ""}
              </>
            ) : (
              "تحديث الآن"
            )}
          </button>
          {!isDownloading && !isDone && (
            <button
              onClick={() => setUpdateInfo((prev) => prev ? { ...prev, show: false } : null)}
              className="flex h-12 w-full items-center justify-center rounded-2xl bg-neutral-100 font-bold text-neutral-700 font-cairo hover:bg-neutral-200 transition-colors"
            >
              لاحقاً
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
