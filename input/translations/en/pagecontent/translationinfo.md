<!-- TRANSLATION INFORMATION — ENGLISH TRANSLATION of the source page
     input/pagecontent/translationinfo.md. Keep structure, headings and links
     1:1 with the source; translate only the text. -->

This guide is authored in **German**, the IG's default language, and rendered
additionally in **English** under `/en/`. Switch languages with the selector in
the navigation bar.

The English rendering is written by hand in this repository — it is not a machine
translation:

| What is translated | Where it comes from |
| --- | --- |
| Narrative pages | [`input/translations/en/pagecontent/`]({{site.data.repo.url}}/tree/{{site.data.repo.branch}}/input/translations/en/pagecontent) — one file per source page, same file name |
| Navigation menu | [`input/translations/en/includes/menu.xml`]({{site.data.repo.url}}/blob/{{site.data.repo.branch}}/input/translations/en/includes/menu.xml) |
| The template's own UI strings (footer, table headers, buttons) | The English wording comes from the base template itself. The German catalogs [`translations/stringsBase-de.po`]({{site.data.repo.url}}/blob/{{site.data.repo.branch}}/translations/stringsBase-de.po) and [`stringsArtifacts-de.po`]({{site.data.repo.url}}/blob/{{site.data.repo.branch}}/translations/stringsArtifacts-de.po) are vendored here because the pinned base release ships none |

A page that has no English counterpart is rendered in German on `/en/`, with a
notice at the top of the page saying so.

### Feedback on a translation

Write to the HL7 FHIR Zulip, stream `german/mi-initiative`
(<https://chat.fhir.org>), naming the page and the wording — or open an issue on
the repository this guide is built from. Corrections go through the same
pull-request review as any other change; the step-by-step is in the repository's
[`docs/recipes/add-translation.md`]({{site.data.repo.url}}/blob/{{site.data.repo.branch}}/docs/recipes/add-translation.md).

> The repository's issue tracker is deliberately not linked with a fixed URL:
> a built guide outlives repository moves — such as the move to the MII's
> GitHub organisation, `medizininformatik-initiative` — and a URL burned into
> an older build would go stale. Open the issue on the repository this guide
> was built from; Zulip is reachable regardless. The **file links** on this
> page do carry a repository URL — it comes from one substitution point,
> `input/data/repo.json`, which the migration checklist repoints in a single
> edit; links in builds published before the move keep resolving through
> GitHub's repository redirect.
{: .ig-highlight .ig-highlight-grey}

> **Scope of this guide:** it is the *preview* of the KDS IG template
> (`de.medizininformatikinitiative.template`), not an MII Core Dataset module.
> It exists so the branding can be reviewed in both languages before a template
> release. A module IG carries its own translation-information page.
{: .ig-highlight .ig-highlight-grey}
