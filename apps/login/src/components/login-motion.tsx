import type { LoginMotionPreset } from "@/lib/server/login-motion";

function AuroraScene() {
  return (
    <>
      <div className="login-motion__grain" />
      <div className="login-motion__aurora-grid" />
      <div className="login-motion__aurora-beam login-motion__aurora-beam--one" />
      <div className="login-motion__aurora-beam login-motion__aurora-beam--two" />
      <div className="login-motion__aurora-beam login-motion__aurora-beam--three" />
      <div className="login-motion__aurora-horizon" />
      <div className="login-motion__caption login-motion__caption--aurora">
        <span>IDENTITY SIGNAL</span>
        <strong>ACQUIRED</strong>
      </div>
    </>
  );
}

function OrbitScene() {
  return (
    <>
      <div className="login-motion__grain" />
      <div className="login-motion__orbit-field" />
      <div className="login-motion__orbit-map">
        <span className="login-motion__orbit-track login-motion__orbit-track--outer" />
        <span className="login-motion__orbit-track login-motion__orbit-track--inner" />
        <span className="login-motion__orbit-signal login-motion__orbit-signal--one" />
        <span className="login-motion__orbit-signal login-motion__orbit-signal--two" />
      </div>
      <div className="login-motion__orbit-node login-motion__orbit-node--one">
        <span>01</span>
      </div>
      <div className="login-motion__orbit-node login-motion__orbit-node--two">
        <span>02</span>
      </div>
      <div className="login-motion__orbit-node login-motion__orbit-node--three">
        <span>03</span>
      </div>
      <div className="login-motion__orbit-lock">
        <span className="login-motion__orbit-lock-ring" />
        <span className="login-motion__orbit-lock-mark" />
      </div>
      <div className="login-motion__caption login-motion__caption--orbit">
        <span>TRUST ROUTE</span>
        <strong>VERIFIED</strong>
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
      {preset === "aurora" ? <AuroraScene /> : <OrbitScene />}
    </div>
  );
}
