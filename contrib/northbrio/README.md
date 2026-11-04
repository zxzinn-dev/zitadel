# Patched broker source

This source is based on ZITADEL v4.19.4, commit `101343ad87aef7b0eea7c3522d519308e0ea9547`. The translation warning omits message IDs, template arguments and errors so that verification values do not enter logs. The warning itself remains. The upstream AGPLv3 license is in `LICENSE`.

Build from the repository root with Docker Buildx:

```sh
docker buildx build --load -f contrib/northbrio/Dockerfile --build-arg BUILD_DATE="$(date -u +%Y-%m-%dT%H:%M:%SZ)" -t zitadel-broker .
```

The build runs regression tests against both the unmodified and modified translator. The toolchain and upstream image are digest-pinned; dependency downloads require network access.
