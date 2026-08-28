# Recipe: consume this template in a module IG

**Goal.** Make a module IG render with this MII template.

**Prerequisites.** A module IG project (e.g. one created from
[`mii-kds-module-template`](https://github.com/medizininformatik-initiative/mii-kds-module-template)).

There are three ways to reference the template. The **URL reference** is the
interim default (since 2026-08-28); the **vendored** folder is the
offline/reproducibility fallback; **published** is the endgame, once the
package `de.medizininformatikinitiative.template` is resolvable from a FHIR
package registry — see [issue #6](../../../../issues/6). (A GitHub release
alone does not make it resolvable: this repository already cuts releases, but
the IG Publisher cannot pin a package it cannot resolve.)

## Steps

### A. URL reference — the interim default

1. In the module's `ig.ini`, set
   `template = https://github.com/medizininformatik-initiative/ig-template-mii-kds`.
   The IG Publisher fetches this repository as a zip of the released default
   branch `main` at build time — it needs network access and **follows
   `main`** (every build gets the latest release; strict version pinning
   returns with the published package, C).
2. Build as usual.

### B. Vendored — the offline/reproducibility fallback

1. Copy this template's content (`package/`, `includes/`, `content/` and
   `translations/` — the German UI-string catalogs the pinned base lacks) into
   an `ig-template/` folder in the module repo.
2. In the module's `ig.ini`, set `template = #ig-template` (the leading `#` makes it
   a **local folder**, not a package id).
3. Build as usual.

A module created from `mii-kds-module-template` has this pre-wired: its
`ig-template/` folder is synced from this repository's `dev` branch by its
`scripts/sync-ig-template.sh`.

### C. Published — once the package is on a registry

1. In the module's `ig.ini`, set:
   `template = de.medizininformatikinitiative.template#<version>` — any version
   from the [releases page](https://github.com/medizininformatik-initiative/ig-template-mii-kds/releases).
   > **Why a pinned version, not `#current`:** reproducible builds — the same input
   > always produces the same rendered guide.
2. Delete `ig-template/` and its sync machinery — the module scaffold ships a
   recipe for exactly that switch (`switch-template-to-published.md`).
3. Rebuild the module (`sushi . && java -Xmx6g -jar publisher.jar -ig ig.ini`;
   step 6 of the [dev-container recipe](first-build-in-devcontainer.md) shows
   how to obtain `publisher.jar`). To adopt a newer template release later, bump
   the version and rebuild.

## Expected result

The module IG renders with the template's header, footer, colours and logo —
the NUM-DIZ design by default; to render MII instead, see
[switch the brand to MII](switch-brand-to-mii.md).

## Common errors & fixes

| Symptom | Cause | Fix |
| --- | --- | --- |
| "template not found" | Published version not on a registry yet | Use the URL reference (A) or the vendored fallback (B) until this template is published |
| URL reference fails to fetch | No network at build time (the URL form downloads `main` per build) | Use the vendored fallback (B) |
| Bare `template = ig-template` read as a package | Missing leading `#` | Use `template = #ig-template` for a local folder |
| Branding not applied | Wrong template line or a stale build cache | Fix `ig.ini`; delete `output/`/`template/` and rebuild |
