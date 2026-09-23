/** Only these organization-neutral designs may be shown outside an auth flow. */
export const PUBLIC_SHOWCASE_PRESETS = ["aurora", "orbit"] as const;

export type PublicShowcasePreset = (typeof PUBLIC_SHOWCASE_PRESETS)[number];

export function isPublicShowcasePreset(value: string): value is PublicShowcasePreset {
  return PUBLIC_SHOWCASE_PRESETS.some((preset) => preset === value);
}

export function isPublicShowcasePath(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  return segments.length === 2 && segments[0] === "showcase" && isPublicShowcasePreset(segments[1]);
}
