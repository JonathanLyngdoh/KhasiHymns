const fs = require("fs");

const hymns = JSON.parse(fs.readFileSync("./src/data/hymns.json", "utf8"));

function splitBalanced(line) {
  const words = line.trim().split(/\s+/);
  const result = [];
  let current = [];

  for (let w of words) {
    current.push(w);

    if (/[;,!?]$/.test(w) && current.length >= 4) {
      result.push(current.join(" "));
      current = [];
    } else if (current.length >= 7) {
      result.push(current.join(" "));
      current = [];
    }
  }

  if (current.length > 0) {
    if (current.length <= 2 && result.length > 0) {
      result[result.length - 1] += " " + current.join(" ");
    } else {
      result.push(current.join(" "));
    }
  }

  return result.join("\n");
}

function formatLyrics(text) {
  // Verse numbers
  text = text.replace(/\s*(\d+\.)/g, "\n\n$1");

  // Chorus (Kyud)
  text = text.replace(/\s*Kyud\s*:?/gi, "\n\nKyud:\n");

  const lines = text.split("\n");

  const formatted = lines.map((line) => {
    line = line.trim();
    if (!line) return "";

    if (/^\d+\./.test(line)) return line;
    if (/^Kyud/i.test(line)) return line;

    return splitBalanced(line);
  });

  return formatted.join("\n").trim();
}

const formatted = hymns.map((h) => ({
  ...h,
  lyrics: formatLyrics(h.lyrics),
}));

fs.writeFileSync(
  "./src/data/hymns-formatted.json",
  JSON.stringify(formatted, null, 2),
);

console.log("✅ Hymns formatted successfully!");
