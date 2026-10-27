import { useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Minus, Pencil, Plus } from "lucide-react";
import hymns from "../data/hymns.json";
import ThemeToggle from "../components/ThemeToggle";

interface HymnDetailProps {
  dark: boolean;
  setDark: React.Dispatch<React.SetStateAction<boolean>>;
}

function HymnDetail({ dark, setDark }: HymnDetailProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const hymn = hymns.find((item) => item.id === Number(id));
  const [fontSize, setFontSize] = useState(18);
  const [editing, setEditing] = useState(false);
  const [customKey, setCustomKey] = useState(() =>
    hymn ? localStorage.getItem(`hymn-key-${hymn.id}`) || "" : "",
  );

  if (!hymn) {
    return (
      <main className="page-shell reader-shell">
        <section className="missing-page">
          <h1>Hymn not found</h1>
          <p>It may have been removed or the link may be incomplete.</p>
          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/")}
          >
            <ArrowLeft size={18} aria-hidden="true" />
            Browse hymns
          </button>
        </section>
      </main>
    );
  }

  const displayKey = customKey || hymn.key;

  const saveKey = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    localStorage.setItem(`hymn-key-${hymn.id}`, customKey.trim());
    setCustomKey(customKey.trim());
    setEditing(false);
  };

  const cancelKeyEdit = () => {
    setCustomKey(localStorage.getItem(`hymn-key-${hymn.id}`) || "");
    setEditing(false);
  };

  return (
    <main className="page-shell reader-shell">
      <header className="reader-topbar">
        <button
          type="button"
          className="back-button"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} aria-hidden="true" />
          <span>Hymn list</span>
        </button>
        <ThemeToggle dark={dark} setDark={setDark} />
      </header>

      <section className="reader-heading" aria-labelledby="hymn-title">
        <div className="reader-number">Hymn {hymn.number}</div>
        <h1 id="hymn-title" className="reader-title">
          {hymn.title}
        </h1>
        {hymn.subtitle && <p className="reader-subtitle">{hymn.subtitle}</p>}
      </section>

      <section className="reader-tools" aria-label="Hymn settings">
        {!editing ? (
          <div className="key-display">
            <span className="key-label">Song key</span>
            <span className="key-value">{displayKey || "Not set"}</span>
            <button
              type="button"
              className="key-edit-button"
              onClick={() => {
                setCustomKey(displayKey || "");
                setEditing(true);
              }}
              aria-label="Edit song key"
              title="Edit song key"
            >
              <Pencil size={16} aria-hidden="true" />
            </button>
          </div>
        ) : (
          <form className="key-editor" onSubmit={saveKey}>
            <label className="key-label" htmlFor="hymn-key">
              Song key
            </label>
            <input
              id="hymn-key"
              className="key-input"
              value={customKey}
              onChange={(event) => setCustomKey(event.target.value)}
              placeholder="For example, G major"
              autoComplete="off"
            />
            <button type="submit" className="primary-button">
              Save
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={cancelKeyEdit}
            >
              Cancel
            </button>
          </form>
        )}

        <div className="reading-size">
          <div className="reading-size-controls">
            <button
              type="button"
              className="size-button"
              onClick={() => setFontSize((size) => Math.max(size - 2, 14))}
              disabled={fontSize <= 14}
              aria-label="Decrease lyric text size"
            >
              <Minus size={17} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="size-button"
              onClick={() => setFontSize((size) => Math.min(size + 2, 32))}
              disabled={fontSize >= 32}
              aria-label="Increase lyric text size"
            >
              <Plus size={17} aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      <article
        className="lyrics-sheet"
        aria-label={`Lyrics for ${hymn.title}`}
      >
        <p className="lyrics-text" lang="kha" style={{ fontSize: `${fontSize}px` }}>
          {hymn.lyrics}
        </p>
      </article>

    </main>
  );
}

export default HymnDetail;
