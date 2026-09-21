import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LoginMotion } from "./login-motion";

describe("LoginMotion", () => {
  it("renders the selected organization motion as decoration", () => {
    render(<LoginMotion preset="aurora" />);

    const motion = screen.getByTestId("login-motion");
    expect(motion).toHaveClass("login-motion--aurora");
    expect(motion).toHaveAttribute("aria-hidden", "true");
  });

  it("renders nothing when motion is disabled", () => {
    const { container } = render(<LoginMotion preset="none" />);

    expect(container).toBeEmptyDOMElement();
  });
});
