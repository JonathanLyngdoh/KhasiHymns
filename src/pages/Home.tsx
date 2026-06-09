import { useState } from "react";
import { Link } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import hymns from "../data/hymns.json";

interface HomeProps {
  dark: boolean;
  setDark: React.Dispatch<React.SetStateAction<boolean>>;
}

function Home({ dark, setDark }: HomeProps) {
  const [search, setSearch] = useState("");

  const filtered = hymns.filter(
    (h) =>
      h.title.toLowerCase().includes(search.toLowerCase()) ||
      h.number.includes(search),
  );

  return (
    <div className="max-w-md mx-auto p-4">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900 pb-3">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-2xl font-bold">Khasi Hymns</h1>

          {/* Dark Mode Button */}
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-105 active:scale-95 transition"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search hymn number or title..."
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Hymn List */}
      <div className="mt-4 space-y-2">
        {filtered.map((h) => (
          <Link
            key={h.id}
            to={`/hymn/${h.id}`}
            className="block bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md active:scale-95 transition"
          >
            <div className="font-semibold">
              {h.number}. {h.title}
            </div>

            {(() => {
              const savedKey = localStorage.getItem(`hymn-key-${h.id}`);
              const displayKey = savedKey || h.key;

              return displayKey ? (
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {displayKey}
                </div>
              ) : null;
            })()}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;
