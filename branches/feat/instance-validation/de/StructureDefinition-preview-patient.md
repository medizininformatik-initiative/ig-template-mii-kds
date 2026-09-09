# Preview Patient - MII KDS IG Template — Preview v1.3.4

* [**Inhaltsverzeichnis**](toc.md)
* [**Artefaktübersicht**](artifacts.md)
* **Preview Patient**

## Ressourcenprofil: Preview Patient 

| | |
| :--- | :--- |
| *Offizielle URL*:https://github.com/medizininformatik-initiative/ig-template-mii-kds/StructureDefinition/preview-patient | *Version*:1.3.4 |
| Draft Stand: 2026-09-09 | *Maschinenlesbarer Name*:PreviewPatient |

 
Minimal profile that exists only so the template preview renders a profile page and the instance-validation page's picker has an entry; not an MII artifact. 

**Usages:**

* This Profile is not used by any profiles in this Specification

You can also check for [usages in the FHIR IG Statistics](https://packages2.fhir.org/xig/resource/de.medizininformatikinitiative.template.preview|current/StructureDefinition/StructureDefinition-preview-patient.json)

### Formale Ansichten des Profilinhalts

 [Beschreibung von Profilen, Differentials, Snapshots und deren Repräsentationen](http://build.fhir.org/ig/FHIR/ig-guidance/readingIgs.html#structure-definitions). 

*  [Schlüsselelemente-Tabelle](#tabs-key) 
*  [Differential-Tabelle](#tabs-diff) 
*  [Snapshot-Tabelle](#tabs-snap) 
*  [Statistiken/Referenzen](#tabs-summ) 
*  [Alle](#tabs-all) 

#### Terminology Bindings

#### Constraints

Diese Struktur ist abgeleitet von [Patient](http://hl7.org/fhir/R4/patient.html) 

#### Terminology Bindings

#### Constraints

Diese Struktur ist abgeleitet von [Patient](http://hl7.org/fhir/R4/patient.html) 

** Summary **

Mandatory: 1 element

 **Schlüsselelemente-Ansicht** 

#### Terminology Bindings

#### Constraints

 **Differential-Ansicht** 

Diese Struktur ist abgeleitet von [Patient](http://hl7.org/fhir/R4/patient.html) 

 **Snapshot-AnsichtView** 

#### Terminology Bindings

#### Constraints

Diese Struktur ist abgeleitet von [Patient](http://hl7.org/fhir/R4/patient.html) 

** Summary **

Mandatory: 1 element

 

Weitere Repräsentationen des Profils: [CSV](../StructureDefinition-preview-patient.csv), [Excel](../StructureDefinition-preview-patient.xlsx), [Schematron](../StructureDefinition-preview-patient.sch) 



## Resource Content

```json
{
  "resourceType" : "StructureDefinition",
  "id" : "preview-patient",
  "url" : "https://github.com/medizininformatik-initiative/ig-template-mii-kds/StructureDefinition/preview-patient",
  "version" : "1.3.4",
  "name" : "PreviewPatient",
  "title" : "Preview Patient",
  "status" : "draft",
  "date" : "2026-09-09T18:27:22+00:00",
  "publisher" : "NUM-DIZ",
  "_publisher" : {
    "extension" : [{
      "extension" : [{
        "url" : "lang",
        "valueCode" : "de"
      },
      {
        "url" : "content",
        "valueString" : "NUM-DIZ"
      }],
      "url" : "http://hl7.org/fhir/StructureDefinition/translation"
    }]
  },
  "contact" : [{
    "name" : "NUM-DIZ",
    "telecom" : [{
      "system" : "url",
      "value" : "https://www.netzwerk-universitaetsmedizin.de"
    }]
  }],
  "description" : "Minimal profile that exists only so the template preview renders a profile page and the instance-validation page's picker has an entry; not an MII artifact.",
  "jurisdiction" : [{
    "coding" : [{
      "system" : "urn:iso:std:iso:3166",
      "code" : "DE",
      "display" : "Germany"
    }]
  }],
  "fhirVersion" : "4.0.1",
  "mapping" : [{
    "identity" : "rim",
    "uri" : "http://hl7.org/v3",
    "name" : "RIM Mapping"
  },
  {
    "identity" : "cda",
    "uri" : "http://hl7.org/v3/cda",
    "name" : "CDA (R2)"
  },
  {
    "identity" : "w5",
    "uri" : "http://hl7.org/fhir/fivews",
    "name" : "FiveWs Pattern Mapping"
  },
  {
    "identity" : "v2",
    "uri" : "http://hl7.org/v2",
    "name" : "HL7 v2 Mapping"
  },
  {
    "identity" : "loinc",
    "uri" : "http://loinc.org",
    "name" : "LOINC code for the element"
  }],
  "kind" : "resource",
  "abstract" : false,
  "type" : "Patient",
  "baseDefinition" : "http://hl7.org/fhir/StructureDefinition/Patient",
  "derivation" : "constraint",
  "differential" : {
    "element" : [{
      "id" : "Patient",
      "path" : "Patient"
    },
    {
      "id" : "Patient.name",
      "path" : "Patient.name",
      "min" : 1
    }]
  }
}

```
