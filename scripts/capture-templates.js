const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const brainDir = "C:\\Users\\Administrator\\.gemini\\antigravity-ide\\brain\\d3adb439-2c36-49e4-ac42-00ce7baa4bec";

const targets = [
  {
    name: "screenshot_open_modern_minimalist.png",
    url: "http://localhost:3000/u/demo-modern-minimalist?open=1",
    width: 1200,
    height: 1600,
  },
  {
    name: "screenshot_open_adat_nusantara.png",
    url: "http://localhost:3000/u/demo-adat-nusantara?open=1",
    width: 1200,
    height: 1600,
  },
  {
    name: "screenshot_open_botanical_rustic.png",
    url: "http://localhost:3000/u/demo-botanical-rustic?open=1",
    width: 1200,
    height: 1600,
  },
  {
    name: "screenshot_open_geometris_islami.png",
    url: "http://localhost:3000/u/demo-geometris-islami?open=1",
    width: 1200,
    height: 1600,
  },
  {
    name: "screenshot_mobile_modern_minimalist.png",
    url: "http://localhost:3000/u/demo-modern-minimalist",
    width: 390,
    height: 844,
  },
  {
    name: "screenshot_mobile_adat_nusantara.png",
    url: "http://localhost:3000/u/demo-adat-nusantara",
    width: 390,
    height: 844,
  },
  {
    name: "screenshot_mobile_botanical_rustic.png",
    url: "http://localhost:3000/u/demo-botanical-rustic",
    width: 390,
    height: 844,
  },
  {
    name: "screenshot_mobile_geometris_islami.png",
    url: "http://localhost:3000/u/demo-geometris-islami",
    width: 390,
    height: 844,
  },
];

console.log("Starting screenshot capture...");

for (const t of targets) {
  const outPath = path.join(brainDir, t.name);
  console.log(`Capturing ${t.name} from ${t.url}...`);
  try {
    const cmd = `"${chromePath}" --headless=new --no-sandbox --disable-gpu --disable-crash-reporter --hide-scrollbars --window-size=${t.width},${t.height} --screenshot="${outPath}" "${t.url}"`;
    execSync(cmd, { stdio: "inherit" });
    if (fs.existsSync(outPath)) {
      const stats = fs.statSync(outPath);
      console.log(`  -> SUCCESS: ${t.name} (${stats.size} bytes)`);
    } else {
      console.error(`  -> FAILED: file not found at ${outPath}`);
    }
  } catch (err) {
    console.error(`  -> ERROR capturing ${t.name}:`, err.message);
  }
}

console.log("Screenshot capture completed!");
