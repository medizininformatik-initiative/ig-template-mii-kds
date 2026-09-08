// Guards the instance-validation page (2026-09-08, NUM-DIZ request): the pure
// helpers of content/assets/js/validate.js (request-body builder against the
// verified validator-wrapper API, issue flattening with the wrapper's "level"
// key, the HTML-escaping issue table, the default-URL fallback), and the
// page/fragment contract - both language texts selected per copy (the
// publisher renders the template's content/ once at the root and once per
// language folder), the four routes, the data-protection box, the
// folder-relative footer link, the root-aware QA link and language switcher,
// no external assets, and the CI test lists naming this file.  Run: node --test scripts/validate.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const repo = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const read = (p) => readFileSync(repo(p), "utf8");
// The asset is a browser script with a CommonJS export for exactly this test.
const v = createRequire(import.meta.url)(repo("content/assets/js/validate.js"));

const page = read("content/validate.html");
const footer = read("includes/fragment-footer.html");
const language = read("includes/fragment-language.html");
const js = read("content/assets/js/validate.js");

// A trimmed copy of what validator.fhir.org answered on 2026-09-08 (wrapper
// 1.0.84, core 6.10.3) for a Patient with an unknown property and an invalid
// gender code - note the severity key is "level".
const LIVE_RESPONSE = {
  outcomes: [{
    fileInfo: { fileName: "manually_entered_file.json", fileContent: "{}", fileType: "json" },
    issues: [
      { source: "InstanceValidator", line: 1, col: 67, location: "Patient",
        message: "Unrecognized property 'foo'", type: "STRUCTURE", level: "ERROR", html: "x" },
      { source: "TerminologyEngine", line: 1, col: 59, location: "Patient.gender",
        message: "The value provided ('unknownvalue') was not found in the value set",
        messageId: "Terminology_TX_NoValid_16", type: "CODEINVALID", level: "ERROR" },
      { source: "InstanceValidator", line: 1, col: 2, location: "Patient",
        message: "Constraint failed: dom-6", type: "INVARIANT", level: "WARNING" },
    ],
  }],
  sessionId: "060618ca-de93-4554-8b9b-bb09e13ddbc5",
  validationTimes: {},
};

test("default-URL fallback: empty/blank/non-string -> the public validator; a configured URL wins, trailing slashes trimmed", () => {
  assert.equal(v.DEFAULT_VALIDATOR_URL, "https://validator.fhir.org");
  for (const bad of [undefined, null, "", "   ", 42, {}]) {
    assert.equal(v.resolveValidatorUrl(bad), "https://validator.fhir.org", `fallback for ${String(bad)}`);
  }
  assert.equal(v.resolveValidatorUrl("http://validator.diz.example:3500/"), "http://validator.diz.example:3500");
  assert.equal(v.resolveValidatorUrl("  https://v.example//  "), "https://v.example");
  assert.equal(v.validateEndpoint(""), "https://validator.fhir.org/validate");
  assert.equal(v.validateEndpoint("http://localhost:3500/"), "http://localhost:3500/validate");
});

test("request body: the verified POST /validate shape with this guide's package preset", () => {
  const body = v.buildRequestBody({
    content: '{"resourceType":"Patient"}',
    packageId: "de.medizininformatikinitiative.kerndatensatz.person",
    version: "2026.0.0",
    fhirVersion: "4.0.1",
  });
  assert.deepEqual(body, {
    cliContext: {
      sv: "4.0.1",
      igs: ["de.medizininformatikinitiative.kerndatensatz.person#2026.0.0"],
      profiles: [],
      locale: "en",
    },
    filesToValidate: [{ fileName: "instance.json", fileContent: '{"resourceType":"Patient"}', fileType: "json" }],
  });
  assert.ok(!("sessionId" in body), "no sessionId unless one was minted by a previous response");
  assert.ok(!("txServer" in body.cliContext), "no txServer unless a module configured one");
});

test("request body: profile, terminology server, locale, session and XML detection", () => {
  const body = v.buildRequestBody({
    content: "﻿  <Patient xmlns=\"http://hl7.org/fhir\"/>",
    packageId: "p", version: "1", fhirVersion: "4.0.1",
    profile: "  https://example.org/fhir/StructureDefinition/x  ",
    txServer: "https://ontoserver.mii-termserv.de/fhir",
    locale: "de",
    sessionId: "abc",
  });
  assert.deepEqual(body.cliContext.profiles, ["https://example.org/fhir/StructureDefinition/x"]);
  assert.equal(body.cliContext.txServer, "https://ontoserver.mii-termserv.de/fhir");
  assert.equal(body.cliContext.locale, "de");
  assert.equal(body.sessionId, "abc");
  assert.equal(body.filesToValidate[0].fileType, "xml");
  assert.equal(body.filesToValidate[0].fileName, "instance.xml");
  assert.equal(v.buildRequestBody({ content: "", packageId: "p", version: "1" }).cliContext.sv, "4.0.1",
    "FHIR version defaults to R4");
  assert.equal(v.detectFileType("  {\n}"), "json");
  assert.equal(v.detectFileType("<a/>"), "xml");
});

test("issue renderer: flattens the live response, maps level -> severity, escapes everything", () => {
  const issues = v.flattenIssues(LIVE_RESPONSE);
  assert.equal(issues.length, 3);
  assert.deepEqual(issues[0], {
    severity: "error", line: 1, col: 67, location: "Patient",
    message: "Unrecognized property 'foo'", type: "STRUCTURE",
  });
  assert.deepEqual(v.summarizeIssues(issues), { fatal: 0, error: 2, warning: 1, information: 0 });
  // OperationOutcome-style "severity" is accepted too; garbage yields nothing.
  assert.equal(v.flattenIssues({ outcomes: [{ issues: [{ severity: "Information", message: "m" }] }] })[0].severity,
    "information");
  assert.deepEqual(v.flattenIssues(null), []);
  assert.deepEqual(v.flattenIssues({ outcomes: "nope" }), []);

  const html = v.renderIssuesTable(v.flattenIssues({
    outcomes: [{ issues: [{ level: "ERROR", line: 3, col: 4, location: "Patient.name",
      message: "<script>alert(1)</script> & \"quoted\"", type: "STRUCTURE" }] }],
  }), { severity: "Schweregrad", line: "Zeile:Spalte", location: "Ort", message: "Meldung" });
  assert.ok(!html.includes("<script>"), "message is escaped");
  assert.ok(html.includes("&lt;script&gt;alert(1)&lt;/script&gt; &amp; &quot;quoted&quot;"));
  assert.ok(html.includes("<th>Schweregrad</th><th>Zeile:Spalte</th><th>Ort</th><th>Meldung</th>"), "labels used");
  assert.ok(html.includes("<td>3:4</td>"), "line:col");
  assert.ok(html.includes('class="ig-validate-error"'));
  const empty = v.renderIssuesTable([], { none: "Keine Meldungen" });
  assert.ok(empty.includes('<td colspan="4">Keine Meldungen</td>'), "explicit no-issues row");
});

test("the JS header records the verified API facts and the removal note", () => {
  for (const fact of ["openapi.yml", "POST /validate", "filesToValidate", "cliContext", '"level"', "REMOVAL",
    "Access-Control-Allow-Origin"]) {
    assert.ok(js.includes(fact), fact);
  }
  assert.match(js, /module\.exports = factory\(\)/, "CommonJS export for this test");
  assert.match(js, /typeof document !== "undefined"/, "browser bootstrap guarded");
});

test("page: both language texts selected per copy, the module preset, the four routes, the two boxes, the live box note", () => {
  assert.match(page, /^---\n---\n/, "front matter so Jekyll renders it");
  assert.ok(page.includes("{% assign folderlang = page.dir | remove: '/' %}"), "the copy knows its folder");
  assert.ok(page.includes("{% assign chromelang = folderlang | default: site.data.languages.defLang | default: 'en' %}"),
    "root copy = the IG's default language (single-language builds render only that copy)");
  assert.ok(page.includes("{% if chromelang == 'de' %}{% assign pagelang = 'de' %}{% else %}{% assign pagelang = 'en' %}{% endif %}"),
    "German text for de/, English for every other folder");
  assert.ok(page.includes("{% include fragment-pagebegin.html lang=chromelang %}"), "base chrome in the copy's language");
  assert.ok(page.includes("{% include fragment-pageend.html lang=chromelang %}"));
  assert.ok(page.includes("<!--ReleaseHeader--><p id=\"publish-box\">Publish Box goes here</p><!--EndReleaseHeader-->"),
    "publish-box marker as in the base's template-page.html");
  assert.ok(page.includes("{% if pagelang == 'en' %}") && page.includes("{% if pagelang == 'de' %}"));
  assert.ok(page.includes("site.data.features.validator.url | default: 'https://validator.fhir.org'"),
    "validator URL: module override with the public default");
  assert.ok(page.includes("site.data.features.validator.tx | default: 'https://tx.fhir.org'"),
    "terminology URL: module override with the public default");
  for (const key of ["site.data.fhir.packageId", "site.data.fhir.igVer", "site.data.fhir.canonical",
    "site.data.fhir.version"]) {
    assert.ok(page.includes(`{{ ${key} }}`), `publisher-written key ${key}`);
  }
  for (const route of ['href="https://validator.fhir.org/"', "java -jar validator_cli.jar -version {{ site.data.fhir.version }} -ig {{ pkg }} -tx {{ validator_tx }}",
    'href="https://validator.fhir.org/swagger-ui/index.html"', "docker run -d --name fhir-validator -p 3500:3500 markiantorno/validator-wrapper"]) {
    assert.equal(page.split(route).length - 1, 2, `route present in EN and DE: ${route}`);
  }
  assert.equal(page.split('class="ig-highlight ig-highlight-red"').length - 1, 2, "data-protection box EN + DE");
  assert.equal(page.split('class="ig-highlight ig-highlight-orange"').length - 1, 2, "terminology caveat EN + DE");
  assert.ok(page.includes("synthetic instances only") && page.includes("ausschließlich synthetische"));
  assert.ok(page.includes("outside the\nEU") || page.includes("outside the EU"), "EN: outside the EU");
  assert.ok(page.includes("außerhalb der EU"), "DE: outside the EU");
  for (const locale of ["en", "de"]) {
    assert.ok(page.includes(`data-locale="${locale}"`), `live box ${locale}`);
  }
  assert.equal(page.split('data-validator-url="{{ validator_url }}"').length - 1, 2);
  assert.ok(page.includes("This box sends the pasted text to <code>{{ validator_url }}</code>"));
  assert.ok(page.includes("Diese Box sendet den eingefügten Text an <code>{{ validator_url }}</code>"));
  assert.ok(page.includes('data-page-title="Instanz validieren"') && page.includes('data-page-title="Validate an instance"'));
});

test("page: no external assets - the only script is the template's own, the only outbound call is the validator's", () => {
  const srcs = [...page.matchAll(/<(?:script|link|img|iframe)[^>]*\s(?:src|href)="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(srcs, ["{{ site.data.info.assets }}assets/js/validate.js"]);
  assert.ok(!/<script[^>]*src="https?:/.test(page) && !/<link[^>]*href="https?:/.test(page));
});

test("footer: the validate link in both language branches (folder-relative), the QA link root-aware; language switcher off on root pages", () => {
  assert.ok(footer.includes("{% assign lbl_validate = 'Instanz validieren' %}"));
  assert.ok(footer.includes("{% assign lbl_validate = 'Validate an instance' %}"));
  assert.match(footer, /href="\{\{ rootpath \}\}qa\.html">\{\{ lbl_qa \}\}<\/a> \|\s*<a style="color: var\(--footer-hyperlink-text-color\)" href="\{\{site\.data\.info\.assets\}\}validate\.html">\{\{ lbl_validate \}\}<\/a>/,
    "TOC | QA | Validate order, shared style attribute, folder-relative like the TOC link (lands on the same-language copy)");
  assert.ok(footer.includes("{% assign rootpath = '../' %}{% if page.dir == '/' %}{% assign rootpath = '' %}{% endif %}"));
  assert.ok(!footer.includes('href="../qa.html"'), "no hard-coded ../ left (it escapes the site from a root page)");
  assert.ok(language.startsWith("{% comment %}"));
  assert.ok(language.includes("{% if page.dir != '/' %}\n{% if site.data.languages.langs.size() != 1 %}"),
    "root-page guard wraps the base logic");
  assert.equal(language.split("{% endif %}").length - 1, language.split("{% if ").length - 1 + 0, "ifs balanced");
});

test("CI lists this suite by name (scripts/README.md rule)", () => {
  for (const wf of [".github/workflows/security-scan.yml", ".github/workflows/dependency-check.yml"]) {
    assert.ok(read(wf).includes("scripts/validate.test.mjs"), wf);
  }
  assert.ok(read("scripts/README.md").includes("validate.test.mjs"));
});

// ---- the network flow, every failure path with a fake fetch ----------------
const respond = (ok, status, jsonBody, text = "") => async () => ({
  ok, status,
  json: async () => { if (jsonBody === "NOT_JSON") throw new SyntaxError("Unexpected token"); return jsonBody; },
  text: async () => text,
});
const body = { cliContext: { sv: "4.0.1", igs: ["x#1"] }, filesToValidate: [] };

test("runValidation: a 200 JSON answer resolves issues, summary and the minted session", async () => {
  const live = { sessionId: "s-1", outcomes: [{ fileInfo: { fileName: "instance.json" },
    issues: [{ level: "error", line: 3, col: 5, location: "Patient", message: "bad" },
             { level: "warning", line: 1, col: 1, location: "Patient", message: "meh" }] }] };
  const v1 = await v.runValidation({ url: "https://x/validate", body, fetchImpl: respond(true, 200, live) });
  assert.equal(v1.issues.length, 2);
  assert.equal(v1.summary.error, 1);
  assert.equal(v1.summary.warning, 1);
  assert.equal(v1.sessionId, "s-1");
});

test("runValidation: a non-2xx answer rejects with kind http and the status + body text", async () => {
  await assert.rejects(
    v.runValidation({ url: "https://x/validate", body, fetchImpl: respond(false, 500, null, "boom") }),
    (e) => e.kind === "http" && /HTTP 500: boom/.test(e.message));
});

test("runValidation: a non-JSON 200 answer rejects with kind parse", async () => {
  await assert.rejects(
    v.runValidation({ url: "https://x/validate", body, fetchImpl: respond(true, 200, "NOT_JSON") }),
    (e) => e.kind === "parse");
});

test("runValidation: a network failure rejects with kind network carrying the cause", async () => {
  await assert.rejects(
    v.runValidation({ url: "https://x/validate", body, fetchImpl: async () => { throw new TypeError("Failed to fetch"); } }),
    (e) => e.kind === "network" && /Failed to fetch/.test(e.message));
});

test("runValidation: an aborted request rejects with kind timeout", async () => {
  const abort = Object.assign(new Error("aborted"), { name: "AbortError" });
  await assert.rejects(
    v.runValidation({ url: "https://x/validate", body, fetchImpl: async () => { throw abort; } }),
    (e) => e.kind === "timeout");
});

test("runValidation: the request is a JSON POST carrying the body verbatim", async () => {
  let seen = null;
  await v.runValidation({ url: "https://x/validate", body,
    fetchImpl: async (url, init) => { seen = { url, init }; return (await respond(true, 200, { outcomes: [] })()); } });
  assert.equal(seen.url, "https://x/validate");
  assert.equal(seen.init.method, "POST");
  assert.equal(seen.init.headers["Content-Type"], "application/json");
  assert.deepEqual(JSON.parse(seen.init.body), body);
});

test("page: the live box never submits without JavaScript - no form action, a noscript notice per copy", () => {
  const html = read("content/validate.html");
  assert.equal((html.match(/<form class="ig-validate"/g) || []).length, 2);
  assert.ok(!/<form[^>]*action=/.test(html), "no form action");
  assert.equal((html.match(/<noscript>/g) || []).length, 2);
});

