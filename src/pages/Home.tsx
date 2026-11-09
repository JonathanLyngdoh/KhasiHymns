import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Search, X } from "lucide-react";
import hymns from "../data/hymns.json";
import ThemeToggle from "../components/ThemeToggle";

interface HomeProps {
  dark: boolean;
  setDark: React.Dispatch<React.SetStateAction<boolean>>;
}

function Home({ dark, setDark }: HomeProps) {
  const [search, setSearch] = useState("");
  const query = search.trim().toLocaleLowerCase();
  const savedKeys = useMemo(
    () =>
      new Map(
        hymns.map(
          (hymn) =>
            [hymn.id, localStorage.getItem(`hymn-key-${hymn.id}`)] as const,
        ),
      ),
    [],
  );
  const filtered = useMemo(
    () =>
      hymns.filter((hymn) =>
        [hymn.title, hymn.number, hymn.subtitle]
          .filter(Boolean)
          .some((value) => value.toLocaleLowerCase().includes(query)),
      ),
    [query],
  );

  return (
    <main className="page-shell">
      <header className="app-header">
        <div className="brand-lockup">
          <div className="brand-copy">
            <p className="brand-name">
              <span className="brand-initial">K</span>hasi{" "}
              <span className="brand-initial">H</span>ymns
            </p>
          </div>
        </div>
        <ThemeToggle dark={dark} setDark={setDark} />
      </header>

      <div className="search-box">
        <Search size={20} aria-hidden="true" />
        <input
          id="hymn-search"
          type="search"
          placeholder="Search hymns"
          aria-label="Search hymns by number or title"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          autoComplete="off"
        />
        {search && (
          <button
            type="button"
            className="search-clear"
            onClick={() => setSearch("")}
            aria-label="Clear search"
          >
            <X size={18} aria-hidden="true" />
          </button>
        )}
      </div>

      <section aria-labelledby="catalog-title">
        <div className="catalog-heading">
          <h2 id="catalog-title">{query ? "Search results" : "All hymns"}</h2>
          <p className="catalog-count" aria-live="polite">
            {filtered.length.toLocaleString()} {filtered.length === 1 ? "hymn" : "hymns"}
          </p>
        </div>

        {filtered.length > 0 ? (
          <ul className="hymn-grid">
            {filtered.map((hymn) => {
              const savedKey = savedKeys.get(hymn.id);
              const displayKey = savedKey || hymn.key;

              return (
                <li key={hymn.id}>
                  <Link to={`/hymn/${hymn.id}`} className="hymn-card">
                    <span className="hymn-number" aria-hidden="true">
                      {hymn.number}
                    </span>
                    <span className="hymn-card-copy">
                      <span className="hymn-card-title">{hymn.title}</span>
                      {hymn.subtitle && (
                        <span className="hymn-card-subtitle">{hymn.subtitle}</span>
                      )}
                      {displayKey && (
                        <span className="hymn-card-key">Key · {displayKey}</span>
                      )}
                    </span>
                    <ChevronRight
                      className="hymn-card-chevron"
                      size={19}
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="empty-state" role="status">
            <h3>No hymns found</h3>
            <p>Try another title or hymn number.</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default Home;
