import { LoginMotion } from "@/components/login-motion";
import { isPublicShowcasePreset, PUBLIC_SHOWCASE_PRESETS } from "@/lib/showcase";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export function generateStaticParams() {
  return PUBLIC_SHOWCASE_PRESETS.map((preset) => ({ preset }));
}

export default async function ShowcasePage({ params }: { params: Promise<{ preset: string }> }) {
  const { preset } = await params;
  if (!isPublicShowcasePreset(preset)) {
    notFound();
  }

  return (
    <main aria-label={`${preset} login design preview`} className={`login-shell login-shell--${preset}`}>
      <div className="login-shell__content">
        <div className={`login-stage login-stage--${preset}`}>
          <LoginMotion preset={preset} />
          <div className="login-stage__form">
            <div data-login-card="" inert style={{ padding: "42px 38px" }}>
              <div style={{ color: "#73828a", fontSize: 12, marginBottom: 34 }}>ZITADEL</div>
              <h1>Welcome back</h1>
              <p className="ztdl-p" style={{ margin: "12px 0 36px" }}>
                Sign in to continue to your workspace.
              </p>
              <label htmlFor="showcase-email" style={{ display: "block", marginBottom: 10, fontSize: 13 }}>
                Email address
              </label>
              <input
                id="showcase-email"
                placeholder="name@company.com"
                readOnly
                style={{ width: "100%", padding: "0 14px" }}
              />
              <button
                aria-disabled="true"
                data-testid="submit-button"
                style={{ display: "block", width: "100%", minHeight: 48, marginTop: 22 }}
                type="button"
              >
                Continue
              </button>
              <p className="ztdl-p" style={{ marginTop: 30, fontSize: 12 }}>
                Secure access to your organization
              </p>
            </div>
          </div>
          <div className="login-stage__controls" style={{ fontSize: 12 }}>
            English · Appearance
          </div>
        </div>
      </div>
      <p className="mx-auto max-w-[1190px] px-9 pb-6 text-center text-xs text-slate-500">
        Design preview only · Sign-in is disabled
      </p>
    </main>
  );
}
