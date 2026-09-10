#!/usr/bin/env bash
# check-language-model.sh — fail if the abandoned "English is the default IG
# language" model reappears anywhere in the repository.
#
# WHY THIS EXISTS
#   This IG is German-default with an English translation
#   (`i18n-default-lang: de`, `i18n-lang: [en]`,
#   `translation-sources: [input/translations/en]`) — the model an MII KDS
#   module uses, because a module's guide and its package lead in German. The
#   repo previously ran the opposite model, and when the config was flipped the
#   prose did not follow: comments, skills and recipes kept calling English the
#   default language and kept pointing at an `input/translations/de/` folder
#   that no longer exists. This check makes that class of drift a build failure
#   instead of an audit finding.
#
# WHAT IT CHECKS
#   Every tracked text file is grepped for a short list of assertions that are
#   only true under the old model (see PATTERNS). The patterns match the WRONG
#   claim, not the language pair — "German default, English translation" and
#   "the English /en/ pages" are correct statements and must not match.
#   The check is line-based: a claim broken across a line break (as one comment
#   in includes/fragment-footer.html once was) slips through, so a reviewer is
#   still the second line of defence.
#
# WHEN IT FIRES
#   Fix the wording. If a hit is genuinely legitimate, add it to the explicit
#   exception list below with a one-line reason — never loosen a pattern.
#
# USAGE
#   bash scripts/check-language-model.sh          # from anywhere in the checkout
#   Runs in CI on every pull request into `dev`, where changes land
#   (.github/workflows/security-scan.yml).
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

# Assertions that only hold under the abandoned English-default model. POSIX ERE
# only — `\b` is a GNU extension and does not match on BSD/macOS.
PATTERNS=(
  'english[ -](default|leading|led|source|original)'
  'english( is| stays| remains| as)( the)? (default|leading|authoritative|binding|source|original)'
  'english is the [^.]{0,12}(default|leading) language'
  'en-default'
  'english \((the )?default'
  '\(english, the default'
  'language \(english\)'
  '(default|leading) (ig |content )?language (is|=) english'
  'falls back to english'
  'leave it english'
  'english by default'
  'englisch \(standardsprache\)'
  'auf englisch verfasst'
  'english (—|-) the (source|original)'
  'i18n-default-lang: *en'
  'translations/de[^a-z]'
  'translations/de$'

)

# Explicit exceptions: paths that may contain the patterns above.
#   - this script, because it defines them.
# Add a path here only with a reason; do not loosen a pattern instead.
EXCLUDES=(
  ':(exclude)scripts/check-language-model.sh'
)

args=()
for pattern in "${PATTERNS[@]}"; do
  args+=(-e "$pattern")
done

# git grep exits 0 on a hit, 1 on no hit, and >1 on an error. The error case
# must not be mistaken for a clean tree, so the status is handled explicitly.
set +e
hits="$(git grep -n -I -i -E "${args[@]}" -- . "${EXCLUDES[@]}")"
status=$?
set -e

case "$status" in
  1)
    echo "Language model: no English-default residue found."
    ;;
  0)
    printf '%s\n' "$hits" >&2
    cat >&2 <<'EOF'

ERROR: the IG is German-default with an English translation, but the lines above
claim English is the default/leading/source language, or point at an
input/translations/de/ folder that no longer exists.

  input/pagecontent/**        German source pages
  input/translations/en/**    English translation (renders under /en/)
  input/includes/menu.xml     German source menu

An untranslated page falls back to German. See docs/recipes/add-translation.md.
EOF
    exit 1
    ;;
  *)
    echo "ERROR: git grep failed (exit $status)." >&2
    exit "$status"
    ;;
esac
