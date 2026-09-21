"use client";

import { motion, useReducedMotion } from "motion/react";

import type { LoginMotionPreset } from "@/lib/server/login-motion";

const TILE_POSITIONS = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const SCENE_DURATION = 12;
const EASE = [0.22, 1, 0.36, 1] as const;

type ActivePhase = "identify" | "verify" | "enter";

const PHASES: { id: ActivePhase; label: string; at: number }[] = [
  { id: "identify", label: "IDENTIFY", at: 0 },
  { id: "verify", label: "VERIFY", at: 0.34 },
  { id: "enter", label: "ENTER", at: 0.67 },
];

function ModuleField({ preset, reducedMotion }: { preset: Exclude<LoginMotionPreset, "none">; reducedMotion: boolean }) {
  return (
    <motion.div
      animate={reducedMotion ? undefined : { rotateX: [58, 55, 58], rotateZ: [-38, -35, -38], y: [0, -8, 0] }}
      className={`login-motion__modules login-motion__modules--${preset}`}
      transition={{ duration: SCENE_DURATION, ease: "easeInOut", repeat: Infinity }}
    >
      <svg aria-hidden="true" className="login-motion__routes" viewBox="0 0 100 100">
        <motion.path
          animate={
            reducedMotion ? { opacity: 0.35, pathLength: 1 } : { opacity: [0, 0.65, 0.65, 0], pathLength: [0, 1, 1, 1] }
          }
          d="M16 16 H50 V50 H84"
          initial={reducedMotion ? false : { opacity: 0, pathLength: 0 }}
          transition={{ duration: SCENE_DURATION, ease: EASE, repeat: Infinity, times: [0, 0.32, 0.78, 1] }}
        />
        <motion.path
          animate={reducedMotion ? { opacity: 0.25, pathLength: 1 } : { opacity: [0, 0, 0.5, 0], pathLength: [0, 0, 1, 1] }}
          d="M16 84 H50 V50 H84"
          initial={reducedMotion ? false : { opacity: 0, pathLength: 0 }}
          transition={{ duration: SCENE_DURATION, ease: EASE, repeat: Infinity, times: [0, 0.3, 0.68, 1] }}
        />
      </svg>
      {TILE_POSITIONS.map((position, index) => {
        const active = index === 4;
        const arrival = 0.11 + index * 0.025;

        return (
          <motion.span
            animate={
              reducedMotion
                ? { opacity: 1, scale: 1, z: active ? 48 : 0 }
                : active
                  ? { opacity: [0, 1, 1, 1, 0], scale: [0.88, 1, 1.035, 1, 0.96], z: [0, 0, 54, 48, 0] }
                  : { opacity: [0, 1, 1, 1, 0], scale: [0.9, 1, 1, 1, 0.96], z: [0, 0, 12, 0, 0] }
            }
            className={`login-motion__module login-motion__module--${position}${active ? "login-motion__module--active" : ""}`}
            initial={reducedMotion ? false : { opacity: 0, scale: 0.9, z: 0 }}
            key={position}
            transition={{ duration: SCENE_DURATION, ease: EASE, repeat: Infinity, times: [0, arrival, 0.48, 0.86, 1] }}
          >
            {active ? (
              <motion.i
                animate={reducedMotion ? undefined : { rotate: [45, 45, 225], scale: [0.8, 1, 1] }}
                className="login-motion__mark"
                initial={reducedMotion ? false : { rotate: 45, scale: 0.8 }}
                transition={{ duration: SCENE_DURATION, ease: EASE, repeat: Infinity, times: [0, 0.42, 0.74] }}
              />
            ) : null}
          </motion.span>
        );
      })}
      {[0, 1, 2].map((signal) => (
        <motion.span
          animate={
            reducedMotion
              ? { opacity: 0 }
              : {
                  left: ["9%", "47%", "78%"],
                  opacity: [0, 1, 1, 0],
                  scale: [0.65, 1, 1, 0.7],
                  top: [`${12 + signal * 29}%`, "47%", `${12 + signal * 29}%`],
                }
          }
          className="login-motion__signal"
          initial={reducedMotion ? false : { left: "9%", opacity: 0, scale: 0.65, top: `${12 + signal * 29}%` }}
          key={signal}
          transition={{ delay: signal * 0.38, duration: 5.2, ease: EASE, repeat: Infinity, repeatDelay: 6.8 }}
        />
      ))}
    </motion.div>
  );
}

function Scene({ preset }: { preset: Exclude<LoginMotionPreset, "none"> }) {
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = prefersReducedMotion === true;
  const isAurora = preset === "aurora";

  return (
    <>
      <motion.div
        animate={reducedMotion ? undefined : { opacity: [0.55, 0.9, 0.6], scale: [1, 1.08, 1] }}
        className="login-motion__wash"
        initial={reducedMotion ? false : { opacity: 0.55, scale: 1 }}
        transition={{ duration: SCENE_DURATION, ease: "easeInOut", repeat: Infinity }}
      />
      <div className="login-motion__topline">
        <span>{isAurora ? "AI WORKSPACE" : "TRUST CONTROL"}</span>
        <span className="login-motion__topline-status">
          <motion.i
            animate={
              reducedMotion
                ? undefined
                : { boxShadow: ["0 0 0 3px transparent", "0 0 0 8px transparent"], scale: [0.85, 1.2, 0.85] }
            }
            initial={reducedMotion ? false : { scale: 0.85 }}
            transition={{ duration: 2.4, ease: "easeOut", repeat: Infinity }}
          />
          {isAurora ? "READY" : "VERIFIED"}
        </span>
      </div>
      <motion.div
        animate={reducedMotion ? { opacity: 1, y: 0 } : { opacity: [0, 1, 1, 0], y: [16, 0, 0, -8] }}
        className="login-motion__copy"
        initial={reducedMotion ? false : { opacity: 0, y: 16 }}
        transition={{ duration: SCENE_DURATION, ease: EASE, repeat: Infinity, times: [0, 0.14, 0.88, 1] }}
      >
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
      </motion.div>
      <ModuleField preset={preset} reducedMotion={reducedMotion} />
      <div className="login-motion__progress">
        <motion.span
          animate={reducedMotion ? { scaleX: 1 } : { scaleX: [0, 1] }}
          className="login-motion__progress-fill"
          initial={reducedMotion ? false : { scaleX: 0 }}
          transition={{ duration: SCENE_DURATION, ease: "linear", repeat: Infinity }}
        />
      </div>
      <div className="login-motion__steps">
        {PHASES.map((phase, index) => (
          <motion.span
            animate={
              reducedMotion
                ? { color: "var(--login-accent)", opacity: 1 }
                : { color: ["var(--login-muted)", "var(--login-accent)", "var(--login-muted)"], opacity: [0.45, 1, 0.45] }
            }
            className={`login-motion__step login-motion__step--${phase.id}`}
            initial={reducedMotion ? false : { color: "var(--login-muted)", opacity: 0.45 }}
            key={phase.id}
            transition={{ delay: phase.at * SCENE_DURATION, duration: 3.2, ease: EASE, repeat: Infinity, repeatDelay: 8.8 }}
          >
            <small>0{index + 1}</small>
            {phase.label}
          </motion.span>
        ))}
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
