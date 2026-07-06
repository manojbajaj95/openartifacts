# Releasing

## Automated flow

1. Merge conventional commits to `main` (via PR).
2. [release-please](https://github.com/googleapis/release-please) opens a **Release PR** updating `CHANGELOG.md` and the version in `packages/cli/package.json`.
3. Merge the Release PR → GitHub Release is created (tag: `openartifacts-vX.Y.Z`).
4. The **publish** workflow publishes to npm via [trusted publishing](https://docs.npmjs.com/trusted-publishers/) (OIDC — no `NPM_TOKEN`).

## One-time npm setup (maintainer)

Configure trusted publishing on npm for the `openartifacts` package:

1. Open https://www.npmjs.com/package/openartifacts/access
2. **Trusted Publisher** → GitHub Actions
3. Set:
   - **Organization or user:** `manojbajaj95`
   - **Repository:** `openartifacts`
   - **Workflow filename:** `publish.yml`
   - **Environment:** (leave empty)

## Manual publish (emergency only)

```bash
NPM_OTP=<code> npm run publish:cli
```

## Commit messages

release-please uses [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — minor version bump
- `fix:` — patch version bump
- `feat!:` or `BREAKING CHANGE:` — major version bump
