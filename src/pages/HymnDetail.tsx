import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import hymns from "../data/hymns.json";
import { Pencil, Sun, Moon, ArrowLeft, Minus, Plus } from "lucide-react";

interface HymnDetailProps {
  dark: boolean;
  setDark: React.Dispatch<React.SetStateAction<boolean>>;
}

function HymnDetail({ dark, setDark }: HymnDetailProps) {
  const { id } = useParams();
  const navigate = useNavigate();

  const hymn = hymns.find((h) => h.id === Number(id));

  const [fontSize, setFontSize] = useState(18);
  const [editing, setEditing] = useState(false);

  const getSavedKey = () => {
    if (!hymn) return "";
    return localStorage.getItem(`hymn-key-${hymn.id}`) || "";
  };

  const [customKey, setCustomKey] = useState(getSavedKey());

  if (!hymn) {
    return <div className="p-4">Hymn not found</div>;
  }

  const displayKey = customKey || hymn.key;

  const saveKey = () => {
    localStorage.setItem(`hymn-key-${hymn.id}`, customKey);
    setEditing(false);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {" "}
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-105 active:scale-95 transition"
        >
          <ArrowLeft size={18} />
        </button>

        {/* Dark Mode */}
        <button
          onClick={() => setDark(!dark)}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-105 active:scale-95 transition"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
      {/* Title */}
      <h2 className="text-xl font-bold">
        {hymn.number}. {hymn.title}
      </h2>
      {/* Subtitle */}
      {hymn.subtitle && (
        <div className="text-gray-500 dark:text-gray-400 text-sm mb-2">
          {hymn.subtitle}
        </div>
      )}
      {/* Key Section */}
      <div className="mb-4">
        {!editing ? (
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <span className="font-medium">Key: {displayKey || "Not set"}</span>

            <button
              onClick={() => {
                setEditing(true);
                setCustomKey(displayKey || "");
              }}
              className="text-gray-500 hover:text-gray-800 dark:hover:text-white transition"
            >
              <Pencil size={16} />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              value={customKey}
              onChange={(e) => setCustomKey(e.target.value)}
              placeholder="Enter key (e.g. G Major)"
              className="flex-1 p-2 border rounded-lg dark:bg-gray-800"
            />
            <button
              onClick={saveKey}
              className="px-3 py-1 bg-gray-800 text-white rounded-lg hover:scale-105 active:scale-95 transition"
            >
              Save
            </button>
          </div>
        )}
      </div>
      {/* Font Controls (Improved) */}
      <div className="flex justify-start mb-4">
        <div className="flex items-center gap-1 bg-gray-200 dark:bg-gray-700 rounded-full p-1">
          <button
            onClick={() => setFontSize((prev) => Math.max(prev - 2, 14))}
            className="p-1.5 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            <Minus size={14} />
          </button>

          <button
            onClick={() => setFontSize((prev) => prev + 2)}
            className="p-1.5 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
      {/* Lyrics */}
      <div
        style={{ fontSize: `${fontSize}px` }}
        className="whitespace-pre-line leading-loose"
      >
        {hymn.lyrics}
      </div>
    </div>
  );
}

export default HymnDetail;
