# Login security baseline

[Traditional Chinese](SECURITY_UPGRADE.zh-TW.md)

The Login application tracks the upstream ZITADEL `v4.19.4` Login source,
including signed session-cookie entries, readiness checks for signing keys,
and startup credential validation. Organization motion, public showcase
allowlists, framing policy, and standalone artwork packaging remain fork-owned.
The Go API is deployed from the official `v4.19.4` image; this fork publishes
only the custom Login image and does not claim that its Go tree is that release.

Configure `ZITADEL_SESSION_COOKIE_SECRET` with a secret of at least 32 characters.
All replicas must share it. Keep it in the deployment's secret store, outside
source, images, and delivery bundles. A comma-separated list supports rotation:
the first key signs new entries and every listed key verifies existing entries.
The upstream API-credential fallback is deprecated.

Unsigned legacy cookies are rejected. Users must sign in to the Login UI again
after the upgrade; existing application sessions and issued tokens are unaffected.
Upgrade API and Login together and verify native login, MFA, OIDC callbacks,
logout, and both curated showcase routes before accepting the rollout.

Run `NX_NO_CLOUD=true pnpm nx run-many --projects @zitadel/login --targets lint test-unit build`.
The unit suite exercises missing and forged signatures, session-id/token
tampering, invalid signing secrets, and key rotation. The custom-image workflow
also executes the standalone server and compares both artwork responses with
the packaged source assets, then publishes amd64 and arm64 images by digest.

Upstream advisory: [GHSA-jh92-5mrj-p2w2](https://github.com/zitadel/zitadel/security/advisories/GHSA-jh92-5mrj-p2w2).
