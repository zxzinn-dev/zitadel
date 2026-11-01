/** Only these organization-neutral designs may be shown outside an auth flow. */
export const PUBLIC_SHOWCASE_PRESETS = ["aurora", "orbit"] as const;

export type PublicShowcasePreset = (typeof PUBLIC_SHOWCASE_PRESETS)[number];

/** Accept only explicit origins, never CSP expressions or URL paths. */
export function getShowcaseFrameOrigins(value: string | undefined, development = false): string[] {
  if (!value?.trim()) return [];
  const origins = value.split(",").map((origin) => origin.trim());
  for (const origin of origins) {
    // URL accepts some characters that are delimiters in CSP's grammar.
    if (/[;\s'"]/.test(origin)) return [];
    try {
      const url = new URL(origin);
      const localDevelopment =
        development && url.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
      if (
        (url.protocol !== "https:" && !localDevelopment) ||
        url.origin !== origin ||
        url.hostname.includes("*") ||
        url.username ||
        url.password
      )
        return [];
    } catch {
      return [];
    }
  }
  return [...new Set(origins)];
}

export function isPublicShowcasePreset(value: string): value is PublicShowcasePreset {
  return PUBLIC_SHOWCASE_PRESETS.some((preset) => preset === value);
}

export function isPublicShowcasePath(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  return segments.length === 2 && segments[0] === "showcase" && isPublicShowcasePreset(segments[1]);
}
