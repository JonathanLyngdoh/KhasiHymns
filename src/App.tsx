import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { Download, Share2 } from "lucide-react";
import Home from "./pages/Home";
import HymnDetail from "./pages/HymnDetail";
import { useInstallPrompt } from "./hooks/useInstallPrompt";

const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
const isInStandalone =
  window.matchMedia("(display-mode: standalone)").matches ||
  (window.navigator as Navigator & { standalone?: boolean }).standalone;

function App() {
  const [dark, setDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme
      ? savedTheme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const { deferredPrompt, install } = useInstallPrompt();
  const [showInstall, setShowInstall] = useState(
    () => localStorage.getItem("install-dismissed") !== "true",
  );
  const [showIOSPrompt, setShowIOSPrompt] = useState(
    () => localStorage.getItem("ios-install-dismissed") !== "true",
  );
  const installPromptVisible = Boolean(
    (deferredPrompt && showInstall) ||
      (isIOS && !isInStandalone && showIOSPrompt),
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
    localStorage.setItem("theme", dark ? "dark" : "light");
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", dark ? "#11100f" : "#f2f6f2");
  }, [dark]);

  const dismissInstall = () => {
    localStorage.setItem("install-dismissed", "true");
    setShowInstall(false);
  };

  const dismissIOS = () => {
    localStorage.setItem("ios-install-dismissed", "true");
    setShowIOSPrompt(false);
  };

  return (
    <div className={`app-shell${installPromptVisible ? " with-install-banner" : ""}`}>
      <Routes>
        <Route path="/" element={<Home dark={dark} setDark={setDark} />} />
        <Route
          path="/hymn/:id"
          element={<HymnDetail dark={dark} setDark={setDark} />}
        />
      </Routes>

      {deferredPrompt && showInstall && (
        <aside className="install-banner" aria-label="Install Khasi Hymns">
          <div className="install-banner-heading">
            <Download size={18} aria-hidden="true" />
            Install Khasi Hymns
          </div>
          <p>Add the hymnbook to your home screen for quick access.</p>
          <div className="install-banner-actions">
            <button type="button" onClick={dismissInstall}>
              Later
            </button>
            <button
              type="button"
              className="install-action"
              onClick={install}
            >
              Install
            </button>
          </div>
        </aside>
      )}

      {isIOS && !isInStandalone && showIOSPrompt && (
        <aside className="install-banner" aria-label="Install Khasi Hymns">
          <div className="install-banner-heading">
            <Share2 size={18} aria-hidden="true" />
            Add to your home screen
          </div>
          <p>
            Tap <strong>Share</strong>, then choose <strong>Add to Home Screen</strong>.
          </p>
          <div className="install-banner-actions">
            <button type="button" className="install-action" onClick={dismissIOS}>
              Got it
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}

export default App;
