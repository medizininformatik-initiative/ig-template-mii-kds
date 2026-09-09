# Concepts — how this template works and why

Read this after the [Glossary](glossary.md). It explains the ideas behind this
repository so the recipes and workflows make sense. Every non-obvious choice
carries a **Why**.

## 1. What an IG template is, and why this project proposes an MII-specific one

The HL7 **IG Publisher** renders an Implementation Guide website. It applies
exactly **one template** per build — the template decides the header, footer,
navigation, colours and fonts. This repository is that template, packaged as an
installable FHIR **template package**, `de.medizininformatikinitiative.template`.

A module IG does not copy any layout files. In its `ig.ini` it writes one line —
`template = de.medizininformatikinitiative.template#<version>` — and the IG
Publisher downloads and applies this package.

That is the target state. The package is not on a registry yet
([issue #6](../../../issues/6)), so today a module writes this repository's
**URL** in `ig.ini` instead, and the IG Publisher fetches the released default
branch `main` as a zip at build time — a release here reaches URL-consuming
modules on their next build, but nobody pins a version. As the offline/
reproducibility fallback a module *does* copy these files: it vendors this
repository's `dev` branch into its own `ig-template/` folder and points
`ig.ini` at that folder — the mechanics are in
[workflows.md](workflows.md#how-a-module-consumes-this-template), the status in
[org-move.md](org-move.md).

> **The argument for a shared template package:** if the KDS modules adopted one,
> they would share a single presentation, a branding fix would reach them by
> releasing one version here, and each module would pin a *version* so its build
> stays reproducible. That is the proposal this repository puts to the TF KDS —
> see [org-move.md](org-move.md).

## 2. Derived from `fhir2.base.template` — override, don't fork

This template is **derived from** the HL7 base template
[`fhir2.base.template`](https://github.com/HL7/ig-template-base2) (pinned to
version `0.1.0`). It declares that base as a dependency and ships **only the few
files that differ** — the header, footer and CSS fragments, plus the MII logo.
Everything else (page layouts, Liquid partials, build scripts, translations) is
inherited from the base.

> **Why override instead of copy:** the base template ships the branding fragments
> as *empty placeholders* precisely so a child fills them. Copying the whole base
> would re-introduce drift and lose upstream fixes. The small override surface is
> the entire point — see [styleguide.md](styleguide.md) for the exact files.

> **Why pin the base to `0.1.0` instead of the moving `#current`:** reproducibility.
> A build in 2029 must produce the same output as today. The
> [dependency checker](maintenance.md) watches for a newer base and proposes the
> bump in the continuously-updated dependencies tracking issue, so pinning does
> not mean going stale silently. The MII
> reference repos float `#current` instead — a different trade-off, not an error.

## 3. How an IG is created and published (the big picture)

1. An author writes profiles/value sets in **FSH** and narrative pages in Markdown.
2. **SUSHI** compiles the FSH into FHIR JSON.
3. The **IG Publisher** takes that JSON + this template + a terminology server and
   produces (a) a browsable website and (b) a downloadable FHIR package.
4. The package is published to a **registry** (so tools can install it) and the
   website is hosted (for humans).

This repository sits at step 3: it is the *template* the Publisher applies. It also
ships a tiny **preview IG** so it can build itself and prove the branding renders
before a release (see [workflows.md](workflows.md)).

## 4. Registries and where things get listed

- **FHIR package registry** (`packages.fhir.org`) — where installable packages,
  including template packages, are resolved by id + version.
- **[`FHIR/ig-registry`](https://github.com/FHIR/ig-registry)** — HL7's public
  index; its `templates.json` lists IG **templates** so the Publisher can resolve
  this one by id. This template is deliberately not listed there yet — the
  decision and its rationale are in [org-move.md](org-move.md).
- **Simplifier** — an alternative FHIR registry platform; not required here.

## 5. The MII governance context

The Medical Informatics Initiative (MII) maintains the **Kerndatensatz (KDS)** — a
core dataset split into modules (Person, Diagnose, Prozedur, …), each published as
its own IG. Naming, terminology policy, the release workflow and the reusable CI
are defined in the [MII meta wiki](https://github.com/medizininformatik-initiative/kerndatensatz-meta/wiki).
This template proposes that those module IGs share one presentation (rendered
in the NUM-DIZ design by default, with MII switchable — styleguide §10).
When this document and the wiki disagree, **the wiki wins** — see
[further-reading.md](further-reading.md) for the pages that matter.

## 6. Two version schemes — do not mix them

- **This template repo** is *tooling*; it uses **SemVer** (`0.2.0`) via Release
  Please, because consumers pin to a version and need to know breaking vs
  compatible changes.
- **MII modules** use **CalVer** (`YYYY.n.n`) via the MII Module Release Workflow.

> **Why this matters here:** a module that consumes this template must never confuse
> the template's SemVer with its own CalVer. The two are announced on different
> Zulip topics and cut by different automation on purpose.

## 7. The instance-validation page

Every guide rendered with this template gets one page it did not write:
**`validate.html`** — *Validate an instance* / *Instanz validieren*, at the
site root and, in a multi-language build, in every language folder
(`en/validate.html`, `de/validate.html`), linked from the footer's `Links:`
row (TOC | QA | Validate …). It is the substitute for the ad-hoc validation
Simplifier used to offer (NUM-DIZ request, decided 2026-08-31): an
implementer pastes their **own** FHIR instance and checks it against
**this** module. The page carries, in English and in German:

- the module's package `id#version` and canonical, **auto-filled from the
  build**;
- four routes — (A) the online validator at validator.fhir.org with the exact
  entries to make, (B) a copy-pasteable `validator_cli.jar` line, (C) the
  REST API (Swagger UI link), (D) a self-hosted `markiantorno/validator-wrapper`
  container for a DIZ;
- a prominent **data-protection box**: the public validator is an HL7-hosted
  best-effort service outside the EU — synthetic instances only; real or
  realistic patient data only against a self-hosted instance (route D);
- a terminology caveat: the public `tx.fhir.org` may lack the German SNOMED CT
  extension — point `-tx` at SU-TermServ/Ontoserver for the module's value
  sets;
- a **live box**: textarea + profile picker + optional profile canonical +
  *Validate*, which `POST`s to `<validator>/validate` with the module's
  package preset and renders the issues (severity, line:col, location,
  message) as a table. A visible note says where the text is sent. The page
  loads nothing external; that POST is its only outbound call.

**The profile picker** is built at build time, not in the browser: the
publisher writes `temp/pages/_data/structuredefinitions.json` for **this
guide's own** StructureDefinitions, and the page renders a `<select>` from it
with Liquid (`where_exp` on `kind == 'resource' and derivation ==
'constraint' and abstract != true`, sorted by title, label from
`titlelang.<lang>`). Choosing an entry copies its canonical into the text
box, which stays the single source of the request — so a canonical from a
**dependency** package (those are in no `_data` file) can still be pasted by
hand. A module whose guide has no resource profile — one with only a logical
model — renders no picker at all, only the text box. Three details are load-
bearing and were each measured with publisher 2.3.2:

- the filter is `kind == 'resource'`, not "everything except logical models":
  an extension or a datatype profile is `kind == 'complex-type'`, and handing
  one to the validator answers *"Specified profile type was Extension, but
  found type Patient"*;
- `<select>` and not `<datalist>`, and a plain `<p>` the script removes and
  not `<noscript>`: the publisher's HTML inspector reports any element it does
  not know as a QA warning (`Illegal HTML: Illegal HTML element: …`), and it
  knows neither `datalist` nor `noscript`;
- `site.data.structuredefinitions` must be converted with `where_exp` before
  it is sorted — a `sort` straight on the id→object map aborts the Jekyll run,
  and so does a `sort` on a missing file, hence the `{% assign %}` guard.

**Two validator failures carry no validation issue** and would otherwise
surface as a bare `HTTP 500` (both probed live on 2026-09-09): a package no
registry serves answers with the body *"Unable to resolve package id …"* — an
unpublished preview build is the usual cause — and a profile canonical the
loaded packages do not define answers with an **empty** body. `failureHint()`
maps the two to their own messages (`data-msg-nopackage` / `data-msg-noprofile`).

> **Why it lives here and not in each module:** the template reaches every
> URL-referencing module on its next build (§ 1), so one page here is one
> page everywhere, kept identical. The module side is deliberately tiny — an
> optional menu entry and an optional override file — and is documented in
> `mii-kds-module-template`.

**How the page gets rendered.** The IG Publisher copies a template's
`content/` folder into the Jekyll source tree before Jekyll runs — once at
the site root and once into every language folder (that is why `assets/`
exists per language folder too). A file there **with front matter** is
rendered like any page, so `content/validate.html` becomes
`output/validate.html` plus `output/<lang>/validate.html` per language
(verified with the pinned publisher 2.3.2 on 2026-09-08 by building this
repository's preview: three copies, QA errors 0). Each copy reads its own
folder from Jekyll's `page.dir` (`/`, `/en/`, `/de/`): a language-folder copy
renders chrome and body in that language (German for `de/`, English for any
other folder — the source carries both texts), the root copy renders the
IG's default language, which in a single-language build is the only copy
there is. The footer link is folder-relative like the TOC link, so a reader
lands on the copy in the language they are reading. Two template fragments
are root-aware for the root copy: the footer prefixes `qa.html` with `../`
only from a language folder (a `../` from the site root escapes the output
folder and the publisher's HTML check aborts the build), and the language
switcher renders nothing on a root page (the base's `../<lang>/` links would
escape the site there).

**Where the values come from.** The publisher writes its own data file,
`temp/pages/_data/fhir.json`; the page reads `site.data.fhir.packageId`,
`site.data.fhir.igVer`, `site.data.fhir.canonical` and `site.data.fhir.version`
(the FHIR version). The base template's pre-process copies a module's
`input/data/` into `_data`, so the same optional file that carries the
feedback dashboards (`site.data.features.feedback`) carries the validator
settings:

```json
// input/data/features.json — OPTIONAL; every key has a default
{
  "validator": {
    "url": "https://validator.fhir.org",
    "tx": "https://tx.fhir.org"
  }
}
```

`validator.url` is the base URL the live box posts to and the URL the page
names in its note (default: the public HL7 service). `validator.tx` is the
terminology server the page prints in route B/D and, when set, passes as
`txServer` in the live box's request (default: the public `tx.fhir.org`; a
DIZ points it at its Ontoserver). A missing file or an unset key falls back —
**no module change is required**.

**The data-protection rule is not negotiable.** The default target is a
service outside the EU. The page says so in both languages and in red; a
module that wants its readers to validate anything beyond synthetic examples
sets `validator.url` to a self-hosted instance (route D) and says so in its
own guidance. `input/data/features.json` is the only knob; there is no way to
"switch the warning off", by design.

**Verified API facts** (2026-09-08, `validator.fhir.org` wrapper 1.0.84 /
core 6.10.3) are recorded in the header of `content/assets/js/validate.js`:
the Swagger UI reads `https://validator.fhir.org/openapi.yml`; `POST /validate`
takes `{ cliContext: { sv, igs, profiles, txServer, locale }, filesToValidate:
[{ fileName, fileContent, fileType }] }` (the `sessionId` the spec marks
required is optional in practice), answers `{ outcomes: [{ fileInfo, issues }],
sessionId }`, and the issue's severity key is `level`, not `severity`; CORS
reflects the caller's origin and allows `Content-Type`, so the browser POST
works from any host.

**REMOVAL is one commit:** `content/validate.html`, `content/assets/js/validate.js`,
the `lbl_validate` link in `includes/fragment-footer.html`, and
`scripts/validate.test.mjs` (plus its two CI list entries); the root-aware
QA prefix in the footer and the root guard in the language fragment can stay —
they are inert for pages in the language folders.

