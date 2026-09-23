"use client";

import type { LoginMotionPreset } from "@/lib/server/login-motion";
import { motion, useReducedMotion } from "motion/react";

function LiquidScene({ preset }: { preset: Exclude<LoginMotionPreset, "none"> }) {
  const reducedMotion = useReducedMotion() === true;
  const isAurora = preset === "aurora";
  const photo = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/login-art/${isAurora ? "prism-day" : "prism-night"}.jpg`;

  return (
    <div className="liquid-scene">
      <motion.img
        alt=""
        aria-hidden="true"
        className="liquid-scene__photo"
        src={photo}
        animate={reducedMotion ? undefined : { scale: [1, 1.055, 1], x: [0, -10, 0] }}
        transition={{ duration: 22, ease: "easeInOut", repeat: Infinity }}
      />
      <div className="liquid-scene__shade" />

      <div className="liquid-scene__header">
        <span className="liquid-scene__brand">
          ZITADEL <span>/</span> IDENTITY
        </span>
        <span className="liquid-scene__status">
          <i /> PRIVATE BY DESIGN
        </span>
      </div>

      <div className="liquid-scene__intro">
        <span className="liquid-scene__eyebrow">{isAurora ? "THE ART OF A CLEAR START" : "A SPECTRUM OF POSSIBILITY"}</span>
        <strong>
          {isAurora ? (
            <>
              A clear path
              <br />
              forward.
            </>
          ) : (
            <>
              Step into
              <br />
              what’s next.
            </>
          )}
        </strong>
        <p>
          {isAurora
            ? "A considered space for the people and ideas moving your work forward."
            : "One thoughtful entrance to everything your team can do."}
        </p>
      </div>

      <motion.div
        className="liquid-scene__lens"
        animate={reducedMotion ? undefined : { x: [0, 18, 0], y: [0, -12, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 13, ease: "easeInOut", repeat: Infinity }}
      >
        <span className="liquid-scene__lens-mark">✦</span>
      </motion.div>

      <div className="liquid-scene__note">
        <span className="liquid-scene__note-icon">✦</span>
        <span>Made for a more connected way to work.</span>
      </div>

      <div className="liquid-scene__footer">
        <span>IDENTITY / IN MOTION</span>
        <span className="liquid-scene__footer-line" />
        <span>{isAurora ? "01" : "02"} / 02</span>
      </div>
    </div>
  );
}

export function LoginMotion({ preset }: { preset: LoginMotionPreset }) {
  if (preset === "none") {
    return null;
  }

  return (
    <div aria-hidden="true" className={`login-motion login-motion--${preset}`} data-testid="login-motion">
      <LiquidScene preset={preset} />
    </div>
  );
}
