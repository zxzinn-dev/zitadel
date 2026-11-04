FROM golang:1.25.11-bookworm@sha256:b96f24a8d7d010ea0acb9c3ba99064740f02b6b984612b28bd3c9c5ab9453e38 AS go
FROM node:22-bookworm@sha256:18a6d90fd60542269850c80ca03b29b1d9b14d6b221ac7ee8e35b0d33ef904bd AS build
COPY --from=go /usr/local/go /usr/local/go
ENV PATH="/usr/local/go/bin:${PATH}" GOMAXPROCS=2 GOFLAGS="-p=2" NX_DAEMON=false
WORKDIR /src
COPY . /src/
COPY contrib/northbrio/notification-log.patch /tmp/notification-log.patch
RUN python3 -c 'import json; p="apps/api/project.json"; d=json.load(open(p)); d["targets"]["generate-install"]["options"]["parallel"]=False; open(p,"w").write(json.dumps(d))' \
    && corepack enable \
    && pnpm install --frozen-lockfile
RUN pnpm nx run @zitadel/api:build-linux --parallel=1
RUN cp internal/i18n/translator.go /tmp/translator-patched.go \
    && patch -R -p1 < /tmp/notification-log.patch \
    && if go test ./internal/i18n -run '^TestTranslationWarningDoesNotExposeTemplateData$' -count=1 >/tmp/translation-baseline.txt 2>&1; then exit 1; fi \
    && grep -Fq -- '--- FAIL: TestTranslationWarningDoesNotExposeTemplateData/missing' /tmp/translation-baseline.txt \
    && grep -Fq -- '--- FAIL: TestTranslationWarningDoesNotExposeTemplateData/execution' /tmp/translation-baseline.txt \
    && cp /tmp/translator-patched.go internal/i18n/translator.go \
    && go test ./internal/i18n -run '^TestTranslationWarningDoesNotExposeTemplateData$' -count=1
ARG BUILD_DATE
RUN test -n "${BUILD_DATE}" \
    && date -u -d "${BUILD_DATE}" >/dev/null \
    && CGO_ENABLED=0 GOOS=linux go build -o "/src/zitadel" \
      -ldflags="-s -w -X github.com/zitadel/zitadel/cmd/build.commit=101343ad87ae -X github.com/zitadel/zitadel/cmd/build.date=${BUILD_DATE} -X github.com/zitadel/zitadel/cmd/build.version=v4.19.4+northbrio.4113"

FROM ghcr.io/zitadel/zitadel:v4.19.4@sha256:90a3045b80a2b5b395e1e770302076906af3a5911225af7c464b4f3bd00d0a1b
ARG BUILD_DATE
LABEL org.opencontainers.image.version="v4.19.4+northbrio.4113" \
      org.opencontainers.image.revision="101343ad87aef7b0eea7c3522d519308e0ea9547" \
      org.opencontainers.image.created="${BUILD_DATE}" \
      org.opencontainers.image.source="https://github.com/zitadel/zitadel"
COPY --from=build --chown=zitadel /src/zitadel /app/zitadel
COPY --from=build /src/LICENSE /licenses/zitadel/LICENSE
