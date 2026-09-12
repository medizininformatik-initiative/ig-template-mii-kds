<!-- ÜBERSETZUNGSHINWEISE — Deutsch ist die STANDARDSPRACHE der IG, diese
     Datei ist also die Quelle. Die englische Fassung liegt unter
     input/translations/en/pagecontent/translationinfo.md.
     Diese Seite existiert, weil der Übersetzungshinweis der Basisvorlage auf
     jeder übersetzten Seite auf translationinfo.html verlinkt; ohne sie liefe
     dieser Link ins Leere. -->

Dieser Leitfaden wird auf **Deutsch** verfasst — das ist die Standardsprache
der IG — und zusätzlich auf **Englisch** unter `/en/` dargestellt. Die Sprache
wechseln Sie über die Auswahl in der Navigationsleiste.

Die englische Fassung ist im Repository von Hand geschrieben, es handelt sich
nicht um eine maschinelle Übersetzung:

| Was übersetzt wird | Woher es stammt |
| --- | --- |
| Narrative Seiten | [`input/translations/en/pagecontent/`]({{site.data.repo.url}}/tree/{{site.data.repo.branch}}/input/translations/en/pagecontent) — eine Datei je Quellseite, gleicher Dateiname |
| Navigationsmenü | [`input/translations/en/includes/menu.xml`]({{site.data.repo.url}}/blob/{{site.data.repo.branch}}/input/translations/en/includes/menu.xml) |
| UI-Texte der Vorlage (Fußzeile, Tabellenköpfe, Schaltflächen) | Die englischen Texte bringt die Basisvorlage selbst mit. Die deutschen Kataloge [`translations/stringsBase-de.po`]({{site.data.repo.url}}/blob/{{site.data.repo.branch}}/translations/stringsBase-de.po) und [`stringsArtifacts-de.po`]({{site.data.repo.url}}/blob/{{site.data.repo.branch}}/translations/stringsArtifacts-de.po) sind hier mitgeliefert, weil die gepinnte Basis-Version keine enthält |

Eine Seite ohne englische Entsprechung wird unter `/en/` auf Deutsch dargestellt,
mit einem entsprechenden Hinweis am Seitenanfang.

### Rückmeldungen zu einer Übersetzung

Bitte im HL7-FHIR-Zulip, Stream `german/mi-initiative`
(<https://chat.fhir.org>), Seite und Formulierung nennen — oder ein Issue im
Repository anlegen, aus dem dieser Leitfaden gebaut wird. Korrekturen durchlaufen
dieselbe Pull-Request-Prüfung wie jede andere Änderung; die
Schritt-für-Schritt-Anleitung steht im Repository unter
[`docs/recipes/add-translation.md`]({{site.data.repo.url}}/blob/{{site.data.repo.branch}}/docs/recipes/add-translation.md).

> Der Issue-Tracker des Repositories ist hier bewusst nicht mit fester URL
> verlinkt: Ein einmal gebauter Leitfaden überdauert Repository-Umzüge — etwa
> den Umzug in die GitHub-Organisation der MII
> (`medizininformatik-initiative`) — und eine in einen älteren Build
> eingebrannte URL würde veralten. Legen Sie das Issue im Repository an, aus
> dem dieser Leitfaden gebaut wurde; Zulip bleibt unabhängig davon erreichbar.
> Die **Dateilinks** dieser Seite tragen dagegen eine Repository-URL — sie
> stammt aus einem einzigen Substitutionspunkt, `input/data/repo.json`, den
> die Migrations-Checkliste mit einer einzigen Änderung umstellt; Links in
> vor dem Umzug veröffentlichten Builds funktionieren über die
> Repository-Weiterleitung von GitHub weiter.
{: .ig-highlight .ig-highlight-grey}

> **Geltungsbereich:** Dies ist die *Vorschau* der KDS-IG-Vorlage
> (`de.medizininformatikinitiative.template`) und kein MII-Kerndatensatz-Modul.
> Sie dient nur dazu, das Branding vor einem Release in beiden Sprachen zu
> prüfen. Ein Modul-IG bringt seine eigene Seite mit Übersetzungshinweisen mit.
{: .ig-highlight .ig-highlight-grey}
