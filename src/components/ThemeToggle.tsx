import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  dark: boolean;
  setDark: React.Dispatch<React.SetStateAction<boolean>>;
}

function ThemeToggle({ dark, setDark }: ThemeToggleProps) {
  return (
    <button
      type="button"
      className="icon-button"
      onClick={() => setDark((current) => !current)}
      aria-label={`Switch to ${dark ? "light" : "dark"} mode`}
      aria-pressed={dark}
      title={`Switch to ${dark ? "light" : "dark"} mode`}
    >
      {dark ? <Sun size={19} aria-hidden="true" /> : <Moon size={19} aria-hidden="true" />}
    </button>
  );
}

export default ThemeToggle;
