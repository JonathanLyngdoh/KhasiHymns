import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import HymnDetail from "./pages/HymnDetail";
import { useInstallPrompt } from "./hooks/useInstallPrompt";

// Detect iOS + standalone mode
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
const isInStandalone =
  window.matchMedia("(display-mode: standalone)").matches ||
  (window.navigator as Navigator & { standalone?: boolean }).standalone;

function App() {
  const [dark, setDark] = useState(localStorage.getItem("theme") === "dark");

  const { deferredPrompt, install } = useInstallPrompt();

  // Persist dismissal
  const [showInstall, setShowInstall] = useState(
    localStorage.getItem("install-dismissed") !== "true",
  );

  const [showIOSPrompt, setShowIOSPrompt] = useState(
    localStorage.getItem("ios-install-dismissed") !== "true",
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  const handleDismissInstall = () => {
    localStorage.setItem("install-dismissed", "true");
    setShowInstall(false);
  };

  const handleDismissIOS = () => {
    localStorage.setItem("ios-install-dismissed", "true");
    setShowIOSPrompt(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <Routes>
        <Route path="/" element={<Home dark={dark} setDark={setDark} />} />
        <Route
          path="/hymn/:id"
          element={<HymnDetail dark={dark} setDark={setDark} />}
        />
      </Routes>

      {/* ANDROID INSTALL PROMPT */}
      {deferredPrompt && showInstall && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-sm bg-white dark:bg-gray-800 shadow-2xl rounded-xl p-4 border dark:border-gray-700 z-50">
          <div className="text-sm font-medium mb-2">📱 Install Khasi Hymns</div>

          <div className="text-xs text-gray-500 mb-3">
            Add to home screen for a better experience
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={handleDismissInstall}
              className="px-3 py-1 text-sm"
            >
              Later
            </button>

            <button
              onClick={install}
              className="px-3 py-1 text-sm bg-gray-800 text-white rounded-lg hover:scale-105 active:scale-95 transition"
            >
              Install
            </button>
          </div>
        </div>
      )}

      {/* iPHONE INSTALL GUIDE */}
      {isIOS && !isInStandalone && showIOSPrompt && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-sm bg-white dark:bg-gray-800 shadow-2xl rounded-xl p-4 border dark:border-gray-700 z-50">
          <div className="text-sm font-medium mb-2">📱 Install Khasi Hymns</div>

          <div className="text-xs text-gray-500 mb-3">
            Tap <span className="font-semibold">Share ⬆️</span> then{" "}
            <span className="font-semibold">“Add to Home Screen”</span>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleDismissIOS}
              className="px-3 py-1 text-sm bg-gray-800 text-white rounded-lg hover:scale-105 active:scale-95 transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
