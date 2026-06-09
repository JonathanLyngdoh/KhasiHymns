const fs = require("fs");

const hymns = JSON.parse(fs.readFileSync("./src/data/hymns.json", "utf8"));

const keyMap = JSON.parse(fs.readFileSync("./keys.json", "utf8"));

function extractRef(subtitle) {
  if (!subtitle) return null;
  const match = subtitle.match(/(SDAH|CH|SSS)\s?\d+/i);
  return match ? match[0].toUpperCase().replace(/\s+/g, " ") : null;
}

const updated = hymns.map((h) => {
  const ref = extractRef(h.subtitle);

  return {
    ...h,
    key: ref && keyMap[ref] ? keyMap[ref] : "",
  };
});

fs.writeFileSync(
  "./src/data/hymns-with-keys.json",
  JSON.stringify(updated, null, 2),
);

console.log("✅ Keys applied to hymns!");
