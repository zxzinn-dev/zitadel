import { cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import AuthenticatorPage from "./authenticator/set/page";
import MfaPage from "./mfa/set/page";
import OtpPage from "./otp/[method]/set/page";

const api = vi.hoisted(() => ({
  loadMostRecentSession: vi.fn(),
  getSessionCookieById: vi.fn(),
  getSession: vi.fn(),
  listAuthenticationMethodTypes: vi.fn(),
  getUserByID: vi.fn(),
  registerTOTP: vi.fn(),
  addOTPEmail: vi.fn(),
  addOTPSMS: vi.fn(),
  getEnrollmentAuthorizationError: vi.fn(),
  redirect: vi.fn(),
}));

vi.mock("next/headers", () => ({ headers: async () => new Headers() }));
vi.mock("next/navigation", () => ({ redirect: api.redirect }));
vi.mock("next-intl/server", () => ({ getTranslations: async () => (key: string) => key }));
vi.mock("@/lib/service-url", () => ({ getServiceConfig: () => ({ serviceConfig: {} }) }));
vi.mock("@/lib/session", () => ({
  loadMostRecentSession: api.loadMostRecentSession,
  hasVerifiedPrimaryFactor: () => ({ valid: false }),
}));
vi.mock("@/lib/cookies", () => ({ getSessionCookieById: api.getSessionCookieById }));
vi.mock("@/lib/server/enrollment-guard", () => ({ getEnrollmentAuthorizationError: api.getEnrollmentAuthorizationError }));
vi.mock("@/lib/zitadel", () => ({
  getBrandingSettings: async () => undefined,
  getLoginSettings: async () => undefined,
  getSession: api.getSession,
  listAuthenticationMethodTypes: api.listAuthenticationMethodTypes,
  getUserByID: api.getUserByID,
  registerTOTP: api.registerTOTP,
  addOTPEmail: api.addOTPEmail,
  addOTPSMS: api.addOTPSMS,
}));
vi.mock("@/components/alert", () => ({
  Alert: ({ children }: { children: ReactNode }) => <div role="alert">{children}</div>,
}));
vi.mock("@/components/translated", () => ({
  Translated: ({ namespace, i18nKey }: { namespace: string; i18nKey: string }) => (
    <span>
      {namespace}.{i18nKey}
    </span>
  ),
}));
vi.mock("@/components/dynamic-theme", () => ({ DynamicTheme: ({ children }: { children: ReactNode }) => <>{children}</> }));
vi.mock("@/components/back-button", () => ({ BackButton: () => null }));
vi.mock("@/components/user-avatar", () => ({ UserAvatar: () => null }));
vi.mock("@/components/totp-register", () => ({ TotpRegister: () => <div>Enrollment form</div> }));

describe("enrollment after session cookies expire or are rejected", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    api.loadMostRecentSession.mockResolvedValue(undefined);
    api.getSessionCookieById.mockResolvedValue(undefined);
  });
  afterEach(cleanup);

  test.each(["time-based", "sms", "email"])("OTP %s shows expiry without enrollment or redirect", async (method) => {
    render(
      await OtpPage({
        params: Promise.resolve({ method }),
        searchParams: Promise.resolve({ loginName: "member@example.test", checkAfter: "true" }),
      }),
    );
    expect(screen.getByRole("alert")).toHaveTextContent("error.sessionExpired");
    expect(api.registerTOTP).not.toHaveBeenCalled();
    expect(api.addOTPEmail).not.toHaveBeenCalled();
    expect(api.addOTPSMS).not.toHaveBeenCalled();
    expect(api.getEnrollmentAuthorizationError).not.toHaveBeenCalled();
    expect(api.redirect).not.toHaveBeenCalled();
  });

  test("OTP without context shows the context error", async () => {
    render(await OtpPage({ params: Promise.resolve({ method: "time-based" }), searchParams: Promise.resolve({}) }));
    expect(screen.getByRole("alert")).toHaveTextContent("error.unknownContext");
  });

  test.each([AuthenticatorPage, MfaPage])("factor chooser handles a missing login-name session", async (Page) => {
    render(await Page({ searchParams: Promise.resolve({ loginName: "member@example.test" }) }));
    expect(screen.getByRole("alert")).toHaveTextContent("error.sessionExpired");
    expect(api.listAuthenticationMethodTypes).not.toHaveBeenCalled();
    expect(api.getUserByID).not.toHaveBeenCalled();
  });

  test.each([AuthenticatorPage, MfaPage])("factor chooser handles a session without an identified user", async (Page) => {
    api.getSessionCookieById.mockResolvedValue({ id: "session", token: "synthetic-token" });
    api.getSession.mockResolvedValue({ session: { id: "session", factors: {} } });
    render(await Page({ searchParams: Promise.resolve({ sessionId: "session" }) }));
    expect(screen.getByRole("alert")).toHaveTextContent("error.sessionExpired");
    expect(api.listAuthenticationMethodTypes).not.toHaveBeenCalled();
    expect(api.getUserByID).not.toHaveBeenCalled();
  });

  test("an authorized identified session still reaches TOTP enrollment", async () => {
    api.loadMostRecentSession.mockResolvedValue({ factors: { user: { id: "user" } } });
    api.getEnrollmentAuthorizationError.mockResolvedValue(undefined);
    api.registerTOTP.mockResolvedValue({ uri: "otpauth://synthetic", secret: "synthetic-secret" });
    render(
      await OtpPage({
        params: Promise.resolve({ method: "time-based" }),
        searchParams: Promise.resolve({ loginName: "member@example.test" }),
      }),
    );
    expect(screen.getByText("Enrollment form")).toBeVisible();
    expect(api.registerTOTP).toHaveBeenCalledTimes(1);
  });
});
