# Org move — this repository's home is `medizininformatik-initiative`

**Since 2026-08-27** this repository and its companion
[`mii-kds-module-template`](https://github.com/medizininformatik-initiative/mii-kds-module-template)
live in the `medizininformatik-initiative` organisation — the target their
canonical URLs and package ids named from the start. The move was executed as a
**mirror push into pre-created repositories** (full git history, all branches
and tags; releases recreated; open issues migrated with provenance headers),
because the empty target repositories already existed and a name-colliding
transfer was therefore not possible. The previous home,
`forschungsgruppe-digital-health/ig-template-mii-kds`, is **archived as a
read-only snapshot**: its issue and pull-request numbers cited in the
[CHANGELOG](../CHANGELOG.md) and in migrated issues keep resolving there, and
its GitHub Pages keep serving previews published before the move.

This note replaces the pre-move `docs/project-status.md` and
`docs/migration-cleanup.md` and carries their surviving decisions:

## Decisions that survive the move

| Question | Answer |
| --- | --- |
| Is the template registered in [`FHIR/ig-registry`](https://github.com/FHIR/ig-registry)? | **No — and it must not be** until the explicit decision: [#5](../../../issues/5). |
| Is the package published to a FHIR package registry? | **No.** Since 2026-08-28 modules reference this repository **by URL** in `ig.ini` (the IG Publisher fetches the released default branch `main` at build time), with the **vendored folder as the offline/reproducibility fallback**, re-vendored from this repo's `dev` branch by the module template's `scripts/sync-ig-template.sh` — see [how a module consumes this template](workflows.md#how-a-module-consumes-this-template). Publication is the explicit decision [#6](../../../issues/6). |
| Why is registration deliberately deferred? | An `ig-registry` entry and a package-registry release are *public, hard-to-retract commitments* that imply an owner and a support promise. Until the TF KDS adopts the approach, keeping it unregistered lets the design change freely without stranding consumers or squatting an identifier. |
| Who owns the template after 2026? | **The MII**, for now. MII funding ends end-2026 and **NUM-DIZ takes over IG development and maintenance** — the template already renders the NUM-DIZ corporate design **by default** for that handover (MII stays switchable — [styleguide §10](styleguide.md#10-the-brand-switch-num-diz-corporate-design)); the formal ownership decision stays with the TF KDS: [#7](../../../issues/7). |
| Is this an MII-endorsed artifact? | **Governance is not settled yet** — the repositories are functional and released, adopted as a proposal to the **MII Taskforce Kerndatensatz (TF KDS)**. The open decisions live in the [issue tracker](../../../issues); recorded limits and decided non-fixes in [maintenance.md](maintenance.md). |

## Branch state — `main` and `dev` are reconciled

The documented model is that `main` only ever receives a `dev → main` merge
([CONTRIBUTING.md](../CONTRIBUTING.md)). The 2026-07/08 divergence described in
the pre-move status page was reconciled before the move; the mirror carried the
reconciled state. Anyone needing the full forensic account finds it in the
archived pre-move repository's `docs/project-status.md`.
