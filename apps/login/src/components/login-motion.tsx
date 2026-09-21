import type { LoginMotionPreset } from "@/lib/server/login-motion";

const TILE_POSITIONS = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

function ModuleField({ preset }: { preset: Exclude<LoginMotionPreset, "none"> }) {
  return (
    <div className={`login-motion__modules login-motion__modules--${preset}`}>
      {TILE_POSITIONS.map((position, index) => (
        <span
          className={`login-motion__module login-motion__module--${position}${index === 4 ? "login-motion__module--active" : ""}`}
          key={position}
        >
          {index === 4 ? <i className="login-motion__mark" /> : null}
        </span>
      ))}
      <span className="login-motion__signal login-motion__signal--one" />
      <span className="login-motion__signal login-motion__signal--two" />
      <span className="login-motion__signal login-motion__signal--three" />
    </div>
  );
}

function Scene({ preset }: { preset: Exclude<LoginMotionPreset, "none"> }) {
  const isAurora = preset === "aurora";

  return (
    <>
      <div className="login-motion__wash" />
      <div className="login-motion__topline">
        <span>{isAurora ? "AI WORKSPACE" : "TRUST CONTROL"}</span>
        <span className="login-motion__topline-status">
          <i /> {isAurora ? "READY" : "VERIFIED"}
        </span>
      </div>
      <div className="login-motion__copy">
        <span className="login-motion__eyebrow">{isAurora ? "ORGANIZATION / A01" : "ORGANIZATION / T02"}</span>
        <strong>
          {isAurora ? (
            <>
              Build with intelligence.
              <br />
              Operate with control.
            </>
          ) : (
            <>
              Every identity.
              <br />
              One trusted path.
            </>
          )}
        </strong>
        <p>
          {isAurora
            ? "One secure workspace for enterprise agents, knowledge, and automation."
            : "Policy-aware access that stays visible, bounded, and organization specific."}
        </p>
      </div>
      <ModuleField preset={preset} />
      <div className="login-motion__progress">
        <span className="login-motion__progress-fill" />
      </div>
      <div className="login-motion__steps">
        <span className="login-motion__step login-motion__step--one">IDENTIFY</span>
        <span className="login-motion__step login-motion__step--two">VERIFY</span>
        <span className="login-motion__step login-motion__step--three">ENTER</span>
      </div>
    </>
  );
}

export function LoginMotion({ preset }: { preset: LoginMotionPreset }) {
  if (preset === "none") {
    return null;
  }

  return (
    <div aria-hidden="true" className={`login-motion login-motion--${preset}`} data-testid="login-motion">
      <Scene preset={preset} />
    </div>
  );
}
