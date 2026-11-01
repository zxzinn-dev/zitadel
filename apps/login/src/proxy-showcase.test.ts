import { NextRequest } from "next/server";
import { afterEach, describe, expect, test, vi } from "vitest";
import { proxy } from "./proxy";

vi.mock("./lib/logger", () => ({ createLogger: () => ({ error: vi.fn() }) }));
vi.mock("./lib/service-url", () => ({
  getServiceConfig: () => ({ serviceConfig: { baseUrl: "https://identity.example.com" } }),
}));
vi.mock("./lib/server/security-settings", () => ({ getIframeOrigins: vi.fn(() => null) }));

afterEach(() => vi.unstubAllEnvs());

describe("showcase frame policy", () => {
  test.each(["aurora", "orbit"])(
    "uses configured documentation origins for %s at the production base path",
    async (preset) => {
      vi.stubEnv("NODE_ENV", "production");
      vi.stubEnv("SHOWCASE_FRAME_ORIGINS", "https://docs.northbrio.ai, https://docs.example.com");
      const request = new NextRequest(`https://identity.example.com/ui/v2/login/showcase/${preset}?organization=private`, {
        nextConfig: { basePath: "/ui/v2/login" },
        headers: { "x-zitadel-i18n-organization": "private" },
      });
      const response = await proxy(request);
      expect(response.headers.get("Content-Security-Policy")).toContain(
        "frame-ancestors https://docs.northbrio.ai https://docs.example.com;",
      );
      expect(response.headers.get("Content-Security-Policy")).not.toContain("wiki.zxzinn.dev");
      expect(response.headers.get("x-middleware-request-x-zitadel-i18n-organization")).toBeNull();
    },
  );

  test.each([
    undefined,
    "",
    "https://docs.example.com; script-src *",
    "https://*.example.com",
    "https://docs.example.com/path",
    "https://docs.example.com?query=1",
    "https://docs.example.com#fragment",
    "https://user:password@docs.example.com",
    "http://docs.example.com",
    "https://docs.example.com, *",
    "https://docs.example.com,",
  ])("fails closed for missing or invalid origins: %s", async (value) => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("SHOWCASE_FRAME_ORIGINS", value);
    const response = await proxy(new NextRequest("https://identity.example.com/showcase/aurora"));
    expect(response.headers.get("Content-Security-Policy")).toContain("frame-ancestors 'none';");
  });

  test("does not apply showcase permissions to authentication or nested paths", async () => {
    vi.stubEnv("SHOWCASE_FRAME_ORIGINS", "https://docs.northbrio.ai");
    vi.stubEnv("CSP_FETCH_ENABLED", "false");
    for (const path of ["/loginname", "/showcase/customer-theme", "/showcase/aurora/organization/private"]) {
      const response = await proxy(new NextRequest(`https://identity.example.com${path}`));
      expect(response.headers.get("Content-Security-Policy")).toContain("frame-ancestors 'none';");
      expect(response.headers.get("X-Frame-Options")).toBe("deny");
    }
  });
});
