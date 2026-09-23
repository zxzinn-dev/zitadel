import "server-only";

export const LOGIN_MOTION_PRESETS = ["none", "aurora", "orbit"] as const;

export type LoginMotionPreset = (typeof LOGIN_MOTION_PRESETS)[number];

type LoginMotionConfiguration = {
  default?: LoginMotionPreset;
  organizations?: Record<string, LoginMotionPreset>;
};

const DEFAULT_PRESET: LoginMotionPreset = "none";

function isPreset(value: unknown): value is LoginMotionPreset {
  return typeof value === "string" && LOGIN_MOTION_PRESETS.includes(value as LoginMotionPreset);
}

export function parseLoginMotionConfiguration(value: string | undefined): LoginMotionConfiguration {
  if (!value) {
    return {};
  }

  let candidate: unknown;
  try {
    candidate = JSON.parse(value);
  } catch {
    return {};
  }

  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
    return {};
  }

  const input = candidate as Record<string, unknown>;
  const configuration: LoginMotionConfiguration = {};

  if (isPreset(input.default)) {
    configuration.default = input.default;
  }

  if (input.organizations && typeof input.organizations === "object" && !Array.isArray(input.organizations)) {
    configuration.organizations = Object.fromEntries(
      Object.entries(input.organizations).filter(
        (entry): entry is [string, LoginMotionPreset] => entry[0].length > 0 && isPreset(entry[1]),
      ),
    );
  }

  return configuration;
}

export function resolveLoginMotionPreset(
  organization: string | undefined,
  value = process.env.LOGIN_MOTION_PROFILES,
): LoginMotionPreset {
  const configuration = parseLoginMotionConfiguration(value);

  if (organization) {
    const organizationPreset = configuration.organizations?.[organization];
    if (organizationPreset) {
      return organizationPreset;
    }
  }

  return configuration.default ?? DEFAULT_PRESET;
}
