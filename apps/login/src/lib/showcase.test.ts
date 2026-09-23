import { describe, expect, test } from "vitest";
import { isPublicShowcasePath, isPublicShowcasePreset, PUBLIC_SHOWCASE_PRESETS } from "./showcase";

describe("public login showcase", () => {
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
