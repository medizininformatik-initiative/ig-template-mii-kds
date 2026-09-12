---
name: ig-translate
description: >-
  Multi-language support for MII KDS Implementation Guides — the part the
  TEMPLATE owns. This project's model is English as the default IG language
  and German as the additional rendering. Points at the catalog skill
  fhir-ig-translation for the maintained rendering matrix (which artifacts
  actually render translations) and documents the i18n configuration this
  template is built and tested against and which the module scaffold
  pre-configures, and the
  language-neutrality rules for this template's header/footer/CSS overrides.
  The module-facing translate/harvest workflow lives in the module scaffold
  repository, not here. Report/propose only; any change goes through a pull
  request targeting dev.
license: CC-BY-4.0
---

# ig-translate — multi-language support (template-owner scope)

Adapted from the `ig-translate` skill of the MII KDS sample IG
([`mii-kds-sample-ig-inoffiziell`](https://github.com/forschungsgruppe-digital-health/mii-kds-sample-ig-inoffiziell),
CC-BY-4.0), trimmed to what the **template** owns.

## Scope split (read this first)

Multi-language support is split across the two template repositories:

- **This repo (`ig-template-mii-kds`, the template package)** owns the
  language *mechanism*: the header/footer/CSS overrides, the base template's
  UI-string catalogs, and the documented conventions below.
- **The organization's skill catalog
  ([`agent-skills`](https://github.com/forschungsgruppe-digital-health/agent-skills))**
  owns the guide-facing *workflow*: creating or harvesting the actual
  translation supplements (`input/translations/<lang>/…`) and translated
  narrative pages for a concrete IG, including the supporting tooling. The
  skill is `fhir-ig-translation`. This skill does not install it for you —
  **precondition**, to be run by the user:
  `npx skills add https://github.com/forschungsgruppe-digital-health/agent-skills/tree/<release> --skill fhir-ig-translation --agent claude-code codex --global --yes`
  (pin with the `/tree/<ref>` form; `owner/repo@<tag>` does *not* pin — `@`
  introduces a skill *name* there and the install silently comes from the
  default branch). It began as the `ig-translate` skill of
  `mii-kds-module-template`, which now consumes it from the catalog under its
  catalog name, as a pinned vendored copy.

If the task is "translate this module's content", switch to
`fhir-ig-translation`. Stay here for template mechanics.

## Language policy

**This project's model: English is the default IG language, German the
additional rendering** — following `kerndatensatz-basis`.

- `i18n-default-lang: en` — the guide leads in English.
- `i18n-lang: [de]` — German is the additional rendering.
- Conformance-resource `description`/`name`/`title` stay **German** in the FSH
  (the MII naming conventions prefer German there), surfaced in the English
  guide via a Translation extension.

> **Why en-default (this project's reading):** the MII meta wiki's naming
> conventions prefer German for a conformance resource's
> description/name/title but require a translation extension whose content is
> shown "im englischsprachigen Implementierungsleitfaden" — that phrasing
> assumes an English guide, and `kerndatensatz-basis` is built that way. The
> wiki does not state the rule directly, so no MII rule stops a module from
> choosing otherwise, and the template's overrides are language-neutral either
> way. The model is nevertheless binding wherever the guard runs: here, on
> every pull request into `dev` (`.github/workflows/security-scan.yml`), and in
> a repository created from the module scaffold, which inherits the scaffold's
> own copy (`scripts/language-model-check.sh`, run by `convention-check.yml`
> and never removed by the first-run bootstrap). It reverses an earlier draft
> decision of this project — do not flip a repository back without changing its
> guard too.

## Ground truth: what the toolchain renders — maintained in the catalog

The generic rendering matrix — which artifact kinds actually render
translations, and from which file paths — is maintained in **one** place: the
["what the toolchain actually renders" table of the catalog skill
`fhir-ig-translation`](https://github.com/forschungsgruppe-digital-health/agent-skills/blob/main/skills/fhir-ig-translation/SKILL.md).
This repo deliberately carries **no local copy**: the earlier local table had
drifted from the catalog (its 2026-08-05 revision retired the local claim that
ImplementationGuide/page titles do not render — they *do*, via
`input/translations/<lang>/ImplementationGuide-<ig-id>.po`, imported by the
publisher at load time). Read the catalog table before reasoning about what
renders; the pointer here is the whole of this repo's copy.

What stays **here**, because it is template-owner-specific rather than generic
toolchain behavior:

- **Verification pins.** The catalog table's findings hold on this repo's own
  toolchain pin (IG Publisher 2.2.11 + `fhir2.base.template` 0.1.0). Whenever
  this repo bumps either pin, re-verify the catalog table against this repo's
  preview and report any drift **to the catalog skill** — do not re-grow a
  local copy of the table.
- **This repo's language policy** (English default, German additional — see
  above) decides which language a page falls back to when a translation file
  is missing.
- **The vendored German UI strings and the language-neutral
  header/footer/CSS overrides** (template obligations below) are this
  template's own responsibility, independent of the rendering matrix.

## Configuration the scaffold pre-configures (and this template is verified against)

The template supports — and the module scaffold pre-configures — this
`sushi-config.yaml` parameter set:

```yaml
parameters:
  i18n-default-lang: en          # leading language
  i18n-lang:
    - de                         # additional rendered language(s)
  translation-sources:
    - input/translations/de      # folder holding the translations
```

## What THIS repo must uphold (template obligations)

1. **Every offered language renders.** The header, footer, and CSS fragments
   this template ships must produce correct text in `de` and `en` alike. The
   base's string mechanism — `site.data.stringsBase[include.lang]['<Key>']` —
   is the default way to get that. The header and CSS fragments avoid the
   question entirely: they carry no UI strings, only an asset and its `alt`
   text switched on `include.lang`. The footer fragment does resolve labels,
   and deliberately not through the base: the base has no `Impressum` key, a
   child template cannot add one, and the pinned base ships no German catalog,
   so those lookups render blank on `/de/`. It hard-codes an
   `include.lang`-branched label set instead. Read `docs/styleguide.md` §5 and §6
   before changing it, and keep every branch complete when adding a language.
2. **Vendored German UI strings.** The pinned base
   `fhir2.base.template#0.1.0` ships `.po` catalogs for
   `ar`/`es`/`fr`/`nl`/`pt`/`ru` — **not** `de` (German was added upstream
   after `0.1.0` was cut). This template therefore vendors the base's own
   `translations/stringsBase-de.po` and `stringsArtifacts-de.po`; `.po` files
   layer additively, so a new filename supplements the base rather than
   replacing it. After a base bump, verify the German strings still render in
   the preview — and delete the vendored copies once the pinned base ships `de`
   itself.
3. **Do not "translate" FHIR identifiers.** `name`, `id`, codes, and
   canonical URLs stay as they are, in every language.
4. **Additive only.** Translations are supplements; the English source page is
   never modified by translation work.

## When to activate (in this repo)

- When changing `includes/` or `content/assets/css/` — check that both
  renderings still show correct text (obligation 1).
- When bumping the pinned `fhir2.base.template` version — re-verify the
  catalog skill's rendering table on this repo's preview and the German UI
  strings (obligation 2 and the ground truth above).
- When documenting or reviewing the i18n conventions modules rely on.

Findings are reported and proposed as changes via a pull request **targeting
`dev`** — never merged autonomously, never pushed to `main`.

## References

- Guide-facing workflow + tooling: the `fhir-ig-translation` skill in
  [`agent-skills`](https://github.com/forschungsgruppe-digital-health/agent-skills),
  the organization's skill catalog — the maintained successor of the
  `ig-translate` skill `mii-kds-module-template` used to carry.
- Base template string mechanism and `.po` translations:
  [`HL7/ig-template-base2`](https://github.com/HL7/ig-template-base2)
  (`includes/`, `translations/`).
- MII language rule: MII meta wiki → "Namenskonventionen für
  FHIR‐Ressourcen in der MII" → Sprache.
- HL7 multi-language background: <http://hl7.org/fhir/languages.html>.
