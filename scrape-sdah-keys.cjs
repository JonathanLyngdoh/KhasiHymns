const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const URL = "https://sdahymna.blogspot.com/p/sda-hymn-list.html";

async function scrape() {
  const { data } = await axios.get(URL);
  const $ = cheerio.load(data);

  const text = $("body").text();
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const keyMap = {};

  let currentNumber = null;

  lines.forEach((line) => {
    // detect hymn number
    const numMatch = line.match(/^(\d+)\s/);
    if (numMatch) {
      currentNumber = numMatch[1];
    }

    // detect key in same or nearby line
    if (currentNumber && /key/i.test(line)) {
      const keyRaw = line.toLowerCase();

      let key = "";

      if (keyRaw.includes("g major")) key = "G Major";
      else if (keyRaw.includes("f major")) key = "F Major";
      else if (keyRaw.includes("c major")) key = "C Major";
      else if (keyRaw.includes("d major")) key = "D Major";
      else if (keyRaw.includes("eb")) key = "E♭ Major";
      else if (keyRaw.includes("bb")) key = "B♭ Major";
      else if (keyRaw.includes("ab")) key = "A♭ Major";
      else if (keyRaw.includes("db")) key = "D♭ Major";

      if (key) {
        keyMap[`SDAH ${currentNumber}`] = key;
      }
    }
  });

  fs.writeFileSync("keys-sdah.json", JSON.stringify(keyMap, null, 2));

  console.log("✅ Extracted SDAH keys:", Object.keys(keyMap).length);
}

scrape();
