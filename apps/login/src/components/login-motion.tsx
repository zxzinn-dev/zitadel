import type { LoginMotionPreset } from "@/lib/server/login-motion";

export function LoginMotion({ preset }: { preset: LoginMotionPreset }) {
  if (preset === "none") {
    return null;
  }

  return (
    <div aria-hidden="true" className={`login-motion login-motion--${preset}`} data-testid="login-motion">
      {preset === "aurora" ? (
        <>
          <span className="login-motion__aurora login-motion__aurora--one" />
          <span className="login-motion__aurora login-motion__aurora--two" />
          <span className="login-motion__aurora login-motion__aurora--three" />
        </>
      ) : (
        <>
          <span className="login-motion__orbit login-motion__orbit--outer" />
          <span className="login-motion__orbit login-motion__orbit--inner" />
          <span className="login-motion__planet" />
        </>
      )}
    </div>
  );
}
