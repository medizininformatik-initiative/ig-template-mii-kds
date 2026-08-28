#!/usr/bin/env node
// gen-pages-index — generate the plain gh-pages root index from what is
// actually deployed.
//
// WHY THIS EXISTS
//   The root index.html used to be a hand-authored landing page that a
//   conservative link rewriter (retired 2026-08-28, together with the page)
//   repointed at each release. Decision 2026-08-28: the root page is a GENERATED
//   web-server-autoindex-style listing of exactly two things —
//
//     branches/dev/        the development preview
//     demo/<latest-tag>/   the latest release demo (the released state of
//                          main; main deliberately has no branch preview)
//
//   Nothing else is listed. Older demo/<tag>/ renderings and other
//   branches/<branch>/ previews STAY DEPLOYED and reachable at their URLs but
//   are deliberately unlisted (the generated page says so in an HTML comment).
//   Because the page is generated from the gh-pages tree, it can never point
//   at something that does not exist, and it heals on every deploy — both
//   release-demo.yml and ig-preview.yml run it before pushing.
//
// WHAT IS LINKED
//   Only what EXISTS in the tree at generation time. If demo/<tag>/ has a
//   root index.html the tag directory is linked directly; if not, its real
//   entry points (de/, en/, qa.html) are listed as sub-links.
//
// USAGE
//   node scripts/gen-pages-index.mjs <gh-pages-checkout> [--check]
//
//     <gh-pages-checkout>  path to a checkout of the gh-pages branch; the
//                          index is written to <gh-pages-checkout>/index.html.
//     --check              dry run: print the generated page to stdout and
//                          write nothing.
//
// Zero runtime dependencies (Node >= 18). The pure logic lives in
// `generateIndex()` so it is unit-tested without touching the file system
// (scripts/gen-pages-index.test.mjs).

import { existsSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const REPO_NAME = "ig-template-mii-kds";
const REPO_URL = "https://github.com/medizininformatik-initiative/ig-template-mii-kds";

/** A released-demo directory name: `v` + SemVer, pre-release suffix allowed. */
const DEMO_TAG_RE = /^v\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;

/** The entry points a demo without a root index.html is known to expose. */
const DEMO_ENTRY_CANDIDATES = ["de/", "en/", "qa.html"];

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/**
 * SemVer comparison for `vX.Y.Z[-pre]` directory names. Numeric fields compare
 * numerically (so v0.10.0 > v0.9.9); a pre-release sorts BELOW its release,
 * and pre-release identifiers compare per SemVer §11 (numeric < alphanumeric).
 */
export function compareSemver(a, b) {
  const parse = (v) => {
    const m = String(v).match(/^v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?/);
    if (!m) throw new Error(`not a semver tag: ${v}`);
    return { nums: [Number(m[1]), Number(m[2]), Number(m[3])], pre: m[4] };
  };
  const pa = parse(a);
  const pb = parse(b);
  for (let i = 0; i < 3; i += 1) {
    if (pa.nums[i] !== pb.nums[i]) return pa.nums[i] - pb.nums[i];
  }
  if (!pa.pre && !pb.pre) return 0;
  if (!pa.pre) return 1; // release > its own pre-release
  if (!pb.pre) return -1;
  const ia = pa.pre.split(".");
  const ib = pb.pre.split(".");
  for (let i = 0; i < Math.max(ia.length, ib.length); i += 1) {
    if (ia[i] === undefined) return -1;
    if (ib[i] === undefined) return 1;
    const na = /^\d+$/.test(ia[i]);
    const nb = /^\d+$/.test(ib[i]);
    if (na && nb) {
      if (Number(ia[i]) !== Number(ib[i])) return Number(ia[i]) - Number(ib[i]);
    } else if (na !== nb) {
      return na ? -1 : 1; // numeric identifiers sort before alphanumeric
    } else if (ia[i] !== ib[i]) {
      return ia[i] < ib[i] ? -1 : 1;
    }
  }
  return 0;
}

/** The highest release tag among `vX.Y.Z[-pre]` names; null when none. */
export function highestSemverTag(tags) {
  const valid = tags.filter((t) => DEMO_TAG_RE.test(t));
  if (valid.length === 0) return null;
  return valid.sort(compareSemver).at(-1);
}

/**
 * Inspect a gh-pages checkout for the two things the index lists.
 *
 * @param {string} root  path to the gh-pages checkout
 * @returns {{dev: boolean, demoTag: string|null, demoEntries: string[]}}
 *   `demoEntries` is `["index.html"]` when the demo has a root index (the tag
 *   directory is then linked directly), otherwise the existing entry points
 *   out of de/, en/, qa.html.
 */
export function discoverTree(root) {
  const dev = existsSync(join(root, "branches", "dev"));
  const demoDir = join(root, "demo");
  let demoTag = null;
  let demoEntries = [];
  if (existsSync(demoDir)) {
    const tags = readdirSync(demoDir).filter((name) => {
      try {
        return statSync(join(demoDir, name)).isDirectory();
      } catch {
        return false;
      }
    });
    demoTag = highestSemverTag(tags);
  }
  if (demoTag) {
    if (existsSync(join(demoDir, demoTag, "index.html"))) {
      demoEntries = ["index.html"];
    } else {
      demoEntries = DEMO_ENTRY_CANDIDATES.filter((entry) =>
        existsSync(
          entry.endsWith("/")
            ? join(demoDir, demoTag, entry, "index.html")
            : join(demoDir, demoTag, entry),
        ),
      );
    }
  }
  return { dev, demoTag, demoEntries };
}

/**
 * Render the root index. Pure — no file-system access.
 *
 * @param {object} options
 * @param {string}  options.repo         repository name shown in the header
 * @param {boolean} options.dev          branches/dev/ exists
 * @param {string|null} options.demoTag  latest release tag with a deployed demo
 * @param {string[]} [options.demoEntries]  `["index.html"]` → link demo/<tag>/
 *   directly; otherwise the entry points to list as sub-links (de/, en/, qa.html)
 * @param {string} [options.repoUrl]     repository URL for the header link
 * @returns {string} the complete index.html
 */
export function generateIndex({ repo, dev, demoTag, demoEntries = [], repoUrl = REPO_URL }) {
  const lines = [];
  if (dev) {
    lines.push(
      `<li><a href="branches/dev/">branches/dev/</a> <span class="note">— development preview</span></li>`,
    );
  }
  if (demoTag) {
    const tag = escapeHtml(demoTag);
    const note = `<span class="note">— latest release demo (the released state of main)</span>`;
    if (demoEntries.includes("index.html")) {
      lines.push(`<li><a href="demo/${tag}/">demo/${tag}/</a> ${note}</li>`);
    } else {
      const subLinks = demoEntries
        .map((entry) => {
          const e = escapeHtml(entry);
          return `<li><a href="demo/${tag}/${e}">${e}</a></li>`;
        })
        .join("\n");
      lines.push(`<li>demo/${tag}/ ${note}\n<ul>\n${subLinks}\n</ul>\n</li>`);
    }
  }
  const list =
    lines.length > 0
      ? `<ul>\n${lines.join("\n")}\n</ul>`
      : `<p class="note">Nothing deployed yet.</p>`;

  return `<!doctype html>
<!-- generated by scripts/gen-pages-index.mjs - do not edit by hand -->
<!-- Older demo/<tag>/ renderings and other branches/<branch>/ previews stay
     deployed and reachable at their URLs but are deliberately unlisted. -->
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(repo)}</title>
<style>
  :root { color-scheme: light dark; }
  body {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    background: Canvas; color: CanvasText;
    max-width: 44rem; margin: 2rem auto; padding: 0 1rem;
  }
  h1 { font-size: 1rem; font-weight: 600; }
  ul { list-style: none; padding-left: 0; }
  ul ul { padding-left: 2ch; }
  li { margin: 0.25rem 0; }
  .note { opacity: 0.65; }
</style>
</head>
<body>
<h1>Index of <a href="${escapeHtml(repoUrl)}">${escapeHtml(repo)}</a></h1>
<hr>
${list}
<hr>
</body>
</html>
`;
}

// ── CLI ────────────────────────────────────────────────────────────────────
export function main(argv) {
  const args = argv.filter((a) => a !== "--check");
  const check = args.length !== argv.length;
  const root = args[0];
  if (!root) {
    console.error("usage: node scripts/gen-pages-index.mjs <gh-pages-checkout> [--check]");
    return 2;
  }
  if (!existsSync(root) || !statSync(root).isDirectory()) {
    console.error(`gen-pages-index: not a directory: ${root}`);
    return 2;
  }
  const state = discoverTree(root);
  const html = generateIndex({ repo: REPO_NAME, repoUrl: REPO_URL, ...state });
  console.log(
    `gen-pages-index: dev preview ${state.dev ? "present" : "absent"}; latest demo ${
      state.demoTag
        ? `${state.demoTag} (${state.demoEntries.includes("index.html") ? "root index.html" : `entry points: ${state.demoEntries.join(", ") || "none"}`})`
        : "none"
    }.`,
  );
  if (check) {
    process.stdout.write(html);
    console.error("gen-pages-index: --check — nothing written.");
    return 0;
  }
  const target = join(root, "index.html");
  writeFileSync(target, html);
  console.log(`gen-pages-index: wrote ${target} (${Buffer.byteLength(html)} bytes).`);
  return 0;
}

const invokedDirectly =
  process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href;

if (invokedDirectly) {
  process.exit(main(process.argv.slice(2)));
}
