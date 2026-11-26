// Holds the highlight-box titles to the heading outline (issue #33).
//
// IG Publisher 3.0+ reports a heading that skips a level as an error
// (HTML_HEADING_LEVEL_SKIPPED, a WCAG check). The box title used to be
// styled only as <h5>, so pages put an <h5> straight under a ### section. The
// rules now style a title at any level h2-h6 alike and keep the base
// template's section number off it. This test checks both halves: the CSS
// contract in template-base.css, and that no page here skips a level with a
// box title.
//
// Rationale: docs/styleguide.md §3.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const css = readFileSync(join(root, "content/assets/css/template-base.css"), "utf8")
  .replace(/\/\*[\s\S]*?\*\//g, ""); // strip comments so prose cannot trip us

const LEVELS = ["h2", "h3", "h4", "h5", "h6"];
const VARIANTS = ["blue", "green", "orange", "red", "grey"];
const PREFIXES = ["ig", "mii"]; // mii-* stays as a deprecated alias

/** Every `selector { body }` rule outside @media blocks, selectors split on top-level commas. */
function rules(text) {
  const out = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(text))) {
    const selectors = [];
    let depth = 0;
    let current = "";
    for (const ch of m[1].trim()) {
      if (ch === "(") depth++;
      if (ch === ")") depth--;
      if (ch === "," && depth === 0) {
        selectors.push(current.trim());
        current = "";
      } else current += ch;
    }
    selectors.push(current.trim());
    out.push({ selectors, body: m[2] });
  }
  return out;
}

/** Expands `.a :is(h2, h3)` into `.a h2`, `.a h3`, so selectors compare plainly. */
function expand(selector) {
  const m = selector.match(/^(.*):is\(([^)]*)\)(.*)$/);
  if (!m) return [selector.replace(/\s+/g, " ")];
  return m[2].split(",").flatMap((part) => expand(`${m[1]}${part.trim()}${m[3]}`));
}

const all = rules(css).map((r) => ({ ...r, expanded: r.selectors.flatMap(expand) }));
const declares = (selector, property, value) =>
  all.some((r) => r.expanded.includes(selector) && new RegExp(`(^|;)\\s*${property}\\s*:\\s*${value}\\s*(;|$)`).test(r.body));

test("a box title is styled the same at every level h2-h6", () => {
  for (const prefix of PREFIXES) {
    for (const h of LEVELS) {
      assert.ok(declares(`.${prefix}-highlight ${h}`, "margin-top", "0"), `.${prefix}-highlight ${h} has no margin-top: 0`);
      assert.ok(declares(`.${prefix}-highlight ${h}`, "font-size", "14px"), `.${prefix}-highlight ${h} is not sized like the former h5`);
      for (const variant of VARIANTS) {
        assert.ok(
          declares(`.${prefix}-highlight-${variant} ${h}`, "color", `var\\(--ig-highlight-${variant}-heading-color\\)`),
          `.${prefix}-highlight-${variant} ${h} does not use --ig-highlight-${variant}-heading-color`,
        );
      }
    }
  }
});

test("a box title carries no section number and uses none up", () => {
  for (const prefix of PREFIXES) {
    for (const h of LEVELS) {
      const selector = `.${prefix}-highlight ${h}::before`;
      assert.ok(declares(selector, "content", "none"), `${selector} keeps the base section number`);
      assert.ok(declares(selector, "counter-increment", "none"), `${selector} still counts as a section`);
    }
  }
});

function pages(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return pages(path);
    return name.endsWith(".md") ? [path] : [];
  });
}

test("no page skips a heading level with a box title", () => {
  const files = [
    ...pages(join(root, "input/pagecontent")),
    ...pages(join(root, "input/translations")).filter((p) => p.includes("/pagecontent/")),
  ];
  assert.ok(files.length > 0, "no pages found");
  const problems = [];
  for (const file of files) {
    let level = 2; // the page title the layout renders is an <h2>
    let inBox = false;
    readFileSync(file, "utf8").split("\n").forEach((line, i) => {
      const md = line.match(/^(#{2,6})\s/);
      if (md) level = md[1].length;
      if (/<div[^>]*class="[^"]*\b(ig|mii)-highlight\b/.test(line)) inBox = true;
      const html = line.match(/<h([2-6])\b/);
      if (html && inBox && Number(html[1]) > level + 1) {
        problems.push(`${file.slice(root.length)}:${i + 1}: <h${html[1]}> under a level-${level} heading (use <h${level + 1}>)`);
      }
      if (/<\/div>/.test(line)) inBox = false;
    });
  }
  assert.deepEqual(problems, []);
});
