import fs from "fs";

const files = [
  "src/sections/CaseStudies.tsx",
  "src/sections/Comparison.tsx",
  "src/sections/Features.tsx",
  "src/sections/RoiCalculator.tsx",
  "src/sections/CTA.tsx",
  "src/sections/Resources.tsx",
  "src/sections/FAQ.tsx",
  "src/sections/Hero.tsx",
  "src/sections/Integrations.tsx",
  "src/sections/KnowledgeCenter.tsx"
];

const patterns = [
  /\b\d+%/g,
  /\b\d+x\b/gi,
  /\$\d+/g,
  /\b\d+\s*(?:hrs?|hours?|mins?|minutes?|days?|weeks?|months?|seconds?)\b/gi,
  /\b\d+\s*(?:times|reduction|increase|faster|savings)\b/gi,
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  const content = fs.readFileSync(file, "utf8");
  const lines = content.split("\n");
  const matches = [];

  lines.forEach((line, idx) => {
    if (line.trim().startsWith("import ") || line.trim().startsWith("//")) return;
    for (const pat of patterns) {
      const found = line.match(pat);
      if (found) {
        matches.push({ lineNum: idx + 1, text: line.trim(), found });
        break;
      }
    }
  });

  console.log(`\n=== ${file} (${matches.length} matches) ===`);
  matches.forEach(m => {
    console.log(`  L${m.lineNum}: [${m.found.join(", ")}] ${m.text.slice(0, 120)}`);
  });
}
