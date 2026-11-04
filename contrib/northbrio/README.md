# Patched broker source

This source is based on ZITADEL v4.19.4, commit `101343ad87aef7b0eea7c3522d519308e0ea9547`. The translation warning omits message IDs, template arguments and errors so that verification values do not enter logs. The warning itself remains. The upstream AGPLv3 license is in `LICENSE`.

The [Login UI source](https://github.com/zxzinn-dev/zitadel/tree/northbrio-login-source-v4.19.4) is published separately.

Build from a clean checkout without credentials or private configuration in its
working tree. Run from the repository root with Docker Buildx:

```sh
SOURCE_REVISION="$(git rev-parse HEAD)"
BUILD_DATE="$(git show -s --format=%ct "$SOURCE_REVISION" | python3 -c 'import datetime,sys; print(datetime.datetime.fromtimestamp(int(sys.stdin.read()), datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"))')"
docker buildx build --load -f contrib/northbrio/Dockerfile --build-arg "SOURCE_REVISION=$SOURCE_REVISION" --build-arg "BUILD_DATE=$BUILD_DATE" -t zitadel-broker .
```

The build runs regression tests against both the unmodified and modified translator. The toolchain and upstream image are digest-pinned; dependency downloads require network access. The source revision and its commit timestamp identify the build inputs; generated asset metadata may make separate builds differ byte-for-byte.
