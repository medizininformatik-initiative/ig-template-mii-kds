# Preview Patient - MII KDS IG Template — Preview v1.3.4

* [**Table of Contents**](toc.md)
* [**Artifacts Summary**](artifacts.md)
* **Preview Patient**

## Resource Profile: Preview Patient 

| | |
| :--- | :--- |
| *Official URL*:https://github.com/medizininformatik-initiative/ig-template-mii-kds/StructureDefinition/preview-patient | *Version*:1.3.4 |
| Draft as of 2026-09-09 | *Computable Name*:PreviewPatient |

 
Minimal profile that exists only so the template preview renders a profile page and the instance-validation page's picker has an entry; not an MII artifact. 

**Usages:**

* This Profile is not used by any profiles in this Specification

You can also check for [usages in the FHIR IG Statistics](https://packages2.fhir.org/xig/resource/de.medizininformatikinitiative.template.preview|current/StructureDefinition/StructureDefinition-preview-patient.json)

### Formal Views of Profile Content

 [Description of Profiles, Differentials, Snapshots, and their representations](http://build.fhir.org/ig/FHIR/ig-guidance/readingIgs.html#structure-definitions). 

 

Other representations of profile: [CSV](../StructureDefinition-preview-patient.csv), [Excel](../StructureDefinition-preview-patient.xlsx), [Schematron](../StructureDefinition-preview-patient.sch) 



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
  "date" : "2026-09-09T13:10:05+00:00",
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
