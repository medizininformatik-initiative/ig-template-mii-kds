# Security Policy

## Reporting a vulnerability

Please report suspected vulnerabilities **privately** via GitHub's private
vulnerability reporting:

1. Open the **Security** tab **of the repository you are reading this in**.
2. Choose **Report a vulnerability** — that opens a draft security advisory.
3. Describe the issue, affected files/versions, and reproduction steps.

Do **not** open a public issue for security problems.

> **Why private reporting instead of a public issue:** a public report exposes
> consumers of the template before a fixed version exists; the advisory flow
> keeps the report confidential until a fix is released.

## Escalation contact (owner fallback)

Private vulnerability reporting on this repository is the primary, watched
channel. If it is unavailable to you or a report goes unanswered, escalate to
the coordination office of the owning organisation. Ownership is decided
(recorded in [docs/org-move.md](docs/org-move.md)): the **MII** owns the
template repositories until 2026-12-31, **NUM-DIZ** from 2027-01-01. Contact
data researched 2026-08-28:

- **Until 2026-12-31 — MII:** Koordinationsstelle der
  Medizininformatik-Initiative at TMF e.V., Charlottenstr. 42, 10117 Berlin —
  <info@medizininformatik-initiative.de>, +49 30 2200247-0.
- **From 2027-01-01 — NUM-DIZ:** NUM-Koordinierungsstelle at Charité —
  Universitätsmedizin Berlin (head: Ralf Heyder), Luisenstraße 13,
  10117 Berlin — <forschungsnetzwerk-unimedizin@charite.de> (NUM-DIZ project
  coordination: Annalena Herzog).

## Scope

This repository contains a **static IG-Publisher template package** (HTML/Liquid
fragments, CSS, images, configuration). It ships **no runtime service**, stores
no data, and exposes no network endpoints. The security-relevant surface is
therefore limited to:

- **Generated site content** — e.g. script injection (XSS) via template
  fragments that end up in every rendered Implementation Guide.
- **Supply chain** — the CI workflows, pinned actions/tools, and the integrity
  of the published template package that downstream IG builds download.

Reports about the *content* of an Implementation Guide built with this template
belong to that guide's own repository, not here.
