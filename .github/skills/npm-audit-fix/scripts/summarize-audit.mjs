#!/usr/bin/env node
// Summarizes `npm audit --json` output (npm 7+).
// Usage: npm audit --json | node summarize-audit.mjs

const chunks = [];
for await (const chunk of process.stdin) chunks.push(chunk);
const raw = Buffer.concat(chunks).toString("utf8").trim();

if (!raw) {
  console.error("No input. Pipe the output of `npm audit --json` into this script.");
  process.exit(1);
}

let report;
try {
  report = JSON.parse(raw);
} catch {
  console.error("Could not parse input as JSON. Run `npm audit --json`.");
  process.exit(1);
}

const vulns = Object.values(report.vulnerabilities ?? {});
const totals = report.metadata?.vulnerabilities ?? {};
const order = ["critical", "high", "moderate", "low", "info"];

console.log("Vulnerabilities by severity");
for (const level of order) {
  if (totals[level]) console.log(`  ${level.padEnd(9)} ${totals[level]}`);
}
console.log(`  ${"total".padEnd(9)} ${totals.total ?? vulns.length}\n`);

if (vulns.length === 0) {
  console.log("No vulnerabilities found.");
  process.exit(0);
}

const describeFix = (fix) => {
  if (fix === true) return "safe fix";
  if (fix === false || fix == null) return "no fix available";
  const major = fix.isSemVerMajor ? " (MAJOR, breaking)" : "";
  return `upgrade ${fix.name}@${fix.version}${major}`;
};

const rows = vulns
  .map((v) => ({
    name: v.name,
    severity: v.severity,
    direct: v.isDirect ? "direct" : "transitive",
    range: v.range,
    fix: describeFix(v.fixAvailable),
  }))
  .sort((a, b) => order.indexOf(a.severity) - order.indexOf(b.severity));

const width = (key) => Math.max(key.length, ...rows.map((r) => String(r[key]).length));
const cols = ["severity", "name", "direct", "range", "fix"];
const line = (r) => cols.map((c) => String(r[c]).padEnd(width(c))).join("  ");

console.log(line(Object.fromEntries(cols.map((c) => [c, c]))));
console.log(cols.map((c) => "-".repeat(width(c))).join("  "));
rows.forEach((r) => console.log(line(r)));

const safe = rows.filter((r) => r.fix === "safe fix").length;
const major = rows.filter((r) => r.fix.includes("MAJOR")).length;
const none = rows.filter((r) => r.fix === "no fix available").length;

console.log(`\n${safe} fixable with \`npm audit fix\`, ${major} need a major upgrade, ${none} have no fix yet.`);
