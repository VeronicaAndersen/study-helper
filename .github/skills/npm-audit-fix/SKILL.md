---
name: npm-audit-fix
description: Safely assess and remediate npm audit vulnerabilities with non-breaking fixes, verification, and approval before breaking upgrades.
---

# npm audit fix

Fix npm vulnerabilities safely: apply non-breaking fixes automatically, verify the project still works, and ask before anything that could break it.

## Rules

- Never run `npm audit fix --force` without explicit approval from the user. It can install breaking major versions.
- Never delete `package-lock.json` or `node_modules` to "fix" an audit.
- Only change `package.json` and `package-lock.json`. Do not touch application code unless the user asks for a migration.
- If tests or the build fail after a fix, stop and report. Do not keep going.

## Workflow

### 1. Prepare

1. Check that the working tree is clean with `git status`. If not, ask the user to commit or stash first.
2. Create a branch: `git checkout -b chore/npm-audit-fix-<yyyy-mm-dd>`.
3. Run `npm ci` so you start from the lockfile.

### 2. Assess

1. From the repository root, run the summary script at:
   `npm audit --json | node .github/skills/npm-audit-fix/scripts/summarize-audit.mjs`
2. Also check production-only impact: `npm audit --omit=dev`.
3. Tell the user, briefly: how many vulnerabilities per severity, how many affect production, and how many can be fixed without breaking changes.

### 3. Apply safe fixes

1. Run `npm audit fix` (no `--force`).
2. Verify, using the scripts that exist in `package.json`:
   - `npm run build`
   - `npm run lint`
3. If everything passes, commit: `chore(deps): npm audit fix`.

### 4. Handle what remains

Run the summary script again. For each remaining vulnerability, propose one of these and ask before acting:

| Situation | Proposal |
| --- | --- |
| Fix needs a major version of a direct dependency | Upgrade that package alone, check its changelog for breaking changes, then verify |
| Vulnerable transitive dependency, parent not updated yet | Add an `overrides` entry in `package.json` pinning a patched version, then verify |
| Only in devDependencies and not reachable in production | Note it as low risk; fix later if no safe path exists |
| No fix available | Report it, link the advisory, and suggest an alternative package if one exists |

Apply one change at a time and verify after each, so a failure points to one cause.

### 5. Report

End with a short summary:

- Fixed: package, old version, new version, severity
- Remaining: package, severity, reason not fixed, recommended next step
- Verification: build, test and lint results
- Branch name and commits made