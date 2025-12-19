import fs from "node:fs";
import { execSync } from "node:child_process";

const eventPath = process.env.GITHUB_EVENT_PATH;
if (!eventPath) {
  console.error("GITHUB_EVENT_PATH is not set.");
  process.exit(1);
}

const event = JSON.parse(fs.readFileSync(eventPath, "utf8"));
const pr = event.pull_request;
if (!pr) {
  console.error("No pull_request found in the event payload.");
  process.exit(1);
}

const labels = (pr.labels || []).map((label) => label.name).filter(Boolean);
const semverLabel = labels.find((label) => label.startsWith("semver-"));
const allowedSemver = new Set(["semver-patch", "semver-minor"]);

const title = pr.title || "";
const body = pr.body || "";
const semverClass = classifySemverBump(`${title}\n${body}`);
const semverKind = semverLabel || semverClass;

if (semverLabel && !allowedSemver.has(semverLabel)) {
  setOutput("skip", "true");
  console.log(`Skipping review for ${semverLabel} update.`);
  process.exit(0);
}

if (!semverLabel && (semverClass === "major" || semverClass === "unknown")) {
  setOutput("skip", "true");
  console.log(`Skipping review for ${semverClass} update.`);
  process.exit(0);
}

const baseSha = pr.base?.sha;
const headSha = pr.head?.sha || "HEAD";
const baseRef = pr.base?.ref ? `origin/${pr.base.ref}` : null;
const base = baseSha || baseRef;

if (!base) {
  console.error("Unable to determine base ref for diff.");
  process.exit(1);
}

const range = `${base}...${headSha}`;
const diffStat = runGit(`git diff --stat ${range}`);
const diffFiles = runGit(`git diff --name-only ${range}`);
const fullDiff = runGit(`git diff --unified=3 ${range}`, 20 * 1024 * 1024);

let diffText = fullDiff;
let diffTruncated = false;
const maxDiffChars = 120000;
if (diffText.length > maxDiffChars) {
  diffText = `${diffText.slice(0, maxDiffChars)}\n... diff truncated ...`;
  diffTruncated = true;
}

const testsOutcome = process.env.TESTS_OUTCOME || "unknown";
const model = process.env.CODEX_MODEL || "gpt-4o-mini";

const prompt = [
  "You are reviewing a Dependabot pull request.",
  "Write the review in Chinese.",
  "Keep it concise and actionable.",
  "Do not approve or merge; only review.",
  "If no issues, say so explicitly.",
  "",
  `PR title: ${title}`,
  `PR url: ${pr.html_url || "unknown"}`,
  `Labels: ${labels.join(", ") || "none"}`,
  `Semver classification: ${semverKind}`,
  `Tests outcome: ${testsOutcome}`,
  "",
  "Diff stat:",
  diffStat || "none",
  "",
  "Changed files:",
  diffFiles || "none",
  "",
  "Patch:",
  diffText || "none",
].join("\n");

const system = [
  "You are a senior engineer reviewing dependency updates.",
  "Focus on risk, compatibility, breaking changes, and runtime behavior.",
  "Suggest tests only when needed.",
  "Avoid restating obvious diff details.",
].join(" ");

const reviewText = await callOpenAI({
  model,
  system,
  prompt,
});

const marker = "<!-- codex-review -->";
const metaLine = `Tests: ${testsOutcome} | Semver: ${semverKind} | Diff truncated: ${
  diffTruncated ? "yes" : "no"
}`;

const bodyText = [
  marker,
  "## Codex Review (Dependabot)",
  "",
  reviewText.trim(),
  "",
  "---",
  metaLine,
  "",
].join("\n");

fs.writeFileSync("codex-review.md", bodyText);
setOutput("skip", "false");

function runGit(command, maxBuffer = 2 * 1024 * 1024) {
  return execSync(command, { encoding: "utf8", maxBuffer }).trim();
}

function extractVersionPairs(text) {
  const pairs = [];
  const regex = /from\s+([^\s]+)\s+to\s+([^\s]+)/gi;
  let match;
  while ((match = regex.exec(text))) {
    pairs.push({ from: match[1], to: match[2] });
  }
  return pairs;
}

function parseVersion(raw) {
  const match = raw.match(/(\d+)\.(\d+)\.(\d+)/);
  if (!match) return null;
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  };
}

function classifySemver(fromRaw, toRaw) {
  const from = parseVersion(fromRaw);
  const to = parseVersion(toRaw);
  if (!from || !to) return "unknown";
  if (to.major !== from.major) return "major";
  if (to.minor !== from.minor) return "minor";
  if (to.patch !== from.patch) return "patch";
  return "none";
}

function classifySemverBump(text) {
  const pairs = extractVersionPairs(text);
  if (pairs.length === 0) return "unknown";
  let result = "patch";
  for (const pair of pairs) {
    const bump = classifySemver(pair.from, pair.to);
    if (bump === "unknown") return "unknown";
    if (bump === "major") return "major";
    if (bump === "minor") result = "minor";
  }
  return result;
}

function setOutput(name, value) {
  const outputPath = process.env.GITHUB_OUTPUT;
  if (!outputPath) return;
  fs.appendFileSync(outputPath, `${name}=${value}\n`);
}

async function callOpenAI({ model, system, prompt }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("OPENAI_API_KEY is not set.");
    process.exit(1);
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      max_tokens: 700,
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI response missing content.");
  }
  return content;
}
