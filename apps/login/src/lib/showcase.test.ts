import { describe, expect, test } from "vitest";
import { getShowcaseFrameOrigins, isPublicShowcasePath, isPublicShowcasePreset, PUBLIC_SHOWCASE_PRESETS } from "./showcase";

describe("public login showcase", () => {
  test("requires explicit loopback configuration in development", () => {
    expect(getShowcaseFrameOrigins(undefined, true)).toEqual([]);
    expect(getShowcaseFrameOrigins("http://localhost:5175", true)).toEqual(["http://localhost:5175"]);
    expect(getShowcaseFrameOrigins("http://127.0.0.1:5175", true)).toEqual(["http://127.0.0.1:5175"]);
    expect(getShowcaseFrameOrigins("http://[::1]:5175", true)).toEqual(["http://[::1]:5175"]);
    expect(getShowcaseFrameOrigins("http://localhost:5175", false)).toEqual([]);
    expect(getShowcaseFrameOrigins("http://docs.example.com", true)).toEqual([]);
    expect(getShowcaseFrameOrigins("https://docs.example.com,https://docs.example.com")).toEqual([
      "https://docs.example.com",
    ]);
  });
  test("only explicitly curated, organization-neutral presets are public", () => {
    expect(PUBLIC_SHOWCASE_PRESETS).toEqual(["aurora", "orbit"]);
    expect(isPublicShowcasePreset("aurora")).toBe(true);
    expect(isPublicShowcasePreset("orbit")).toBe(true);
    expect(isPublicShowcasePreset("none")).toBe(false);
    expect(isPublicShowcasePreset("customer-theme")).toBe(false);
  });

  test("does not expose arbitrary organization or nested paths", () => {
    expect(isPublicShowcasePath("/showcase/aurora")).toBe(true);
    expect(isPublicShowcasePath("/showcase/orbit/")).toBe(true);
    expect(isPublicShowcasePath("/showcase/customer-theme")).toBe(false);
    expect(isPublicShowcasePath("/showcase/aurora/organization/123")).toBe(false);
  });
});
