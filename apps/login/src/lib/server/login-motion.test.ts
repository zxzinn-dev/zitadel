import { describe, expect, it } from "vitest";
import { parseLoginMotionConfiguration, resolveLoginMotionPreset } from "./login-motion";

describe("login motion configuration", () => {
  it("resolves organization presets before the default", () => {
    const value = JSON.stringify({
      default: "none",
      organizations: {
        "org-aurora": "aurora",
        "org-orbit": "orbit",
      },
    });

    expect(resolveLoginMotionPreset("org-aurora", value)).toBe("aurora");
    expect(resolveLoginMotionPreset("org-orbit", value)).toBe("orbit");
    expect(resolveLoginMotionPreset("org-unknown", value)).toBe("none");
  });

  it("ignores unsupported presets", () => {
    expect(
      parseLoginMotionConfiguration(
        JSON.stringify({
          default: "flash",
          organizations: { safe: "aurora", unsafe: "javascript:alert(1)" },
        }),
      ),
    ).toEqual({ organizations: { safe: "aurora" } });
  });

  it("fails closed for malformed JSON", () => {
    expect(resolveLoginMotionPreset("org-aurora", "not-json")).toBe("none");
  });
});
