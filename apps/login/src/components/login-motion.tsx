"use client";

import type { LoginMotionPreset } from "@/lib/server/login-motion";
import { motion, useReducedMotion } from "motion/react";

function LiquidScene({ preset }: { preset: Exclude<LoginMotionPreset, "none"> }) {
  const reducedMotion = useReducedMotion() === true;
  const isAurora = preset === "aurora";
  const photo = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/login-art/${isAurora ? "prism-day" : "glass-architecture"}.jpg`;

  return (
    <div className="liquid-scene">
      <motion.img
        alt=""
        aria-hidden="true"
        className="liquid-scene__photo"
        src={photo}
        animate={reducedMotion ? undefined : { scale: [1, 1.018, 1], x: [0, -4, 0] }}
        transition={{ duration: 28, ease: "easeInOut", repeat: Infinity }}
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
        <span className="liquid-scene__eyebrow">{isAurora ? "A QUIETER WAY TO BEGIN" : "SPACE TO MOVE FORWARD"}</span>
        <strong>
          {isAurora ? (
            <>
              Room to
              <br />
              begin.
            </>
          ) : (
            <>
              A little more
              <br />
              clarity.
            </>
          )}
        </strong>
        <p>
          {isAurora
            ? "A calm place to connect with the work that matters."
            : "One thoughtful entrance to everything your team can do."}
        </p>
      </div>

      <motion.div
        className="liquid-scene__lens"
        animate={reducedMotion ? undefined : { x: [0, 6, 0], y: [0, -4, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 18, ease: "easeInOut", repeat: Infinity }}
      >
        <span className="liquid-scene__lens-mark">○</span>
      </motion.div>

      <div className="liquid-scene__note">
        <span className="liquid-scene__note-icon">○</span>
        <span>Where your work comes together.</span>
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
