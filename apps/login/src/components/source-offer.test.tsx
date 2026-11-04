import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SourceOffer } from "./source-offer";

describe("SourceOffer", () => {
  it("exposes the corresponding source through a named link", () => {
    render(<SourceOffer label="Source code" />);
    const link = screen.getByRole("link", { name: "Source code" });
    expect(link).toHaveAttribute(
      "href",
      "https://github.com/zxzinn-dev/zitadel/blob/ddc94bda70ec18f7ef09187c9297ba27f0f6bccc/contrib/northbrio/README.md",
    );
    expect(link).toHaveAttribute("rel", "noreferrer");
    link.focus();
    expect(link).toHaveFocus();
  });
});
