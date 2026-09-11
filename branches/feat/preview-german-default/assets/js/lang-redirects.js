// MII template override of the base template's language-redirect landing script.
//
// WHY THIS OVERRIDE EXISTS: fhir2.base.template 0.1.0 (the pinned base release)
// ships a lang-redirects.js whose `return` is misplaced INSIDE the for-loop but
// OUTSIDE the language-match `if`. As a result the loop always exits after
// checking only the first language: a browser whose language is the first one
// (en) is redirected, but a browser in ANY other language (e.g. de-DE) hits
// `return` with no redirect and no fallback, and is left on the blank root
// landing page (a perceived 404 — the root only works if the user manually
// appends /en/ or /de/). The bug is already fixed on fhir2.base.template `main`,
// but base has not cut a new release, so this template carries the corrected
// version until a fixed base release is available (the dependency checker
// watches fhir2.base.template and will flag the bump). This file overrides
// content/assets/js/lang-redirects.js from the base at equal path.
//
// The corrected logic: redirect + return only on a language MATCH, and fall
// through to the default (first) language after the loop when nothing matched.
// Preserves the query string + hash (suffix), like base `main`.
//
// WHICH LANGUAGE "DEFAULT" MEANS: the publisher writes `langs` into the root
// landing page in the order the IG declares them, `i18n-default-lang` first —
// with `i18n-default-lang: de` and `i18n-lang: [en]` the array is
// ["de","en"]. So `langs[0]` IS the IG's default language, and a visitor whose
// browser matches neither language lands on it. Nothing here needs changing
// when an IG switches its default; the order follows the setting.
doRedirect();

function doRedirect() {
  var userLang = navigator.language || navigator.userLanguage;
  var path = window.location.pathname;
  var pageName = path.substring(path.lastIndexOf('/') + 1);
  var suffix = window.location.search + window.location.hash;
  for (i = 0; i < langs.length; i++) {
    if ((userLang == langs[i]) || userLang.startsWith(langs[i] + "-")) {
      window.location.replace(langs[i] + "/" + pageName + suffix);
      return;
    }
  }
  window.location.replace(langs[0] + "/" + pageName + suffix);
}
