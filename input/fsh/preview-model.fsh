// Minimal preview resource (build mechanics only — NOT an MII artifact).
//
// The IG Publisher cannot assemble an installable package for an IG that has zero
// conformance resources (it fails with "Error generating combined package"), so
// the preview ships exactly ONE minimal resource. A Logical Model is used on
// purpose: it needs no terminology server and carries no coded content, so the
// preview builds cleanly on the tx.fhir.org fallback, and it is clearly a
// structural placeholder rather than fake clinical data or terminology. It is
// never published. A real module replaces it with its own profiles/value sets.
Logical: PreviewModel
Id: preview-model
Title: "Preview Model"
Description: "Minimal logical model that exists only so the template preview IG builds and its artifact layout renders; not an MII artifact."
* placeholder 0..1 string "A single placeholder element."

// A SECOND preview resource, and the only profile: it exists so the
// instance-validation page's profile picker has an entry to render — the
// picker lists this guide's own resource profiles (concepts § 7), so without
// a profile the preview would only ever show the empty case. Like the logical
// model above it binds no terminology, carries no clinical content and is
// never published.
Profile: PreviewPatient
Parent: Patient
Id: preview-patient
Title: "Preview Patient"
Description: "Minimal profile that exists only so the template preview renders a profile page and the instance-validation page's picker has an entry; not an MII artifact."
* name 1..*
