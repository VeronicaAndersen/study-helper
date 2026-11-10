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

const order = ["critical", "high", "moderate", "low", "info"];
const fail = (message) => {
  console.error(message);
  process.exit(1);
};

if (!report || typeof report !== "object" || Array.isArray(report)) {
  fail("Invalid npm audit report: expected a JSON object.");
}
if (report.error) {
  const detail = report.error.summary ?? report.error.message ?? JSON.stringify(report.error);
  fail(`npm audit failed: ${detail}`);
}

const vulnerabilities = report.vulnerabilities;
const totals = report.metadata?.vulnerabilities;
if (!vulnerabilities || typeof vulnerabilities !== "object" || Array.isArray(vulnerabilities)) {
  fail("Invalid npm audit report: missing vulnerabilities object.");
}
if (!totals || typeof totals !== "object" || Array.isArray(totals)) {
  fail("Invalid npm audit report: missing metadata.vulnerabilities object.");
}
for (const level of [...order, "total"]) {
  if (!Number.isInteger(totals[level]) || totals[level] < 0) {
    fail(`Invalid npm audit report: missing or invalid ${level} vulnerability count.`);
  }
}

const vulns = Object.values(vulnerabilities);
for (const vuln of vulns) {
  if (
    !vuln ||
    typeof vuln !== "object" ||
    typeof vuln.name !== "string" ||
    !order.includes(vuln.severity) ||
    typeof vuln.isDirect !== "boolean" ||
    typeof vuln.range !== "string" ||
    !Object.hasOwn(vuln, "fixAvailable")
  ) {
    fail("Invalid npm audit report: a vulnerability entry is missing required fields.");
  }
  const fix = vuln.fixAvailable;
  if (
    fix !== null &&
    typeof fix !== "boolean" &&
    (!fix ||
      typeof fix !== "object" ||
      typeof fix.name !== "string" ||
      typeof fix.version !== "string" ||
      typeof fix.isSemVerMajor !== "boolean")
  ) {
    fail(`Invalid npm audit report: invalid fixAvailable data for ${vuln.name}.`);
  }
}

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
const rangeUpdates = vulns.filter(
  (v) => typeof v.fixAvailable === "object" && v.fixAvailable?.isSemVerMajor === false,
).length;
const none = rows.filter((r) => r.fix === "no fix available").length;

console.log(
  `\n${safe} fixable with \`npm audit fix\`, ${major} need a major upgrade, ${rangeUpdates} have non-major dependency-range updates, ${none} have no fix yet.`,
);
