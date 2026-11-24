import { render, screen, fireEvent } from "@testing-library/react";
import DashboardErrorBoundary from "./error";

jest.mock("@sentry/nextjs", () => ({
  captureException: jest.fn(),
}));

jest.mock("@/config/env", () => ({
  clientEnv: {
    NEXT_PUBLIC_SENTRY_DSN: "",
  },
}));

describe("DashboardErrorBoundary", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders clear heading, retry button, dashboard link, and digest without leaking raw error message in production", () => {
    const reset = jest.fn();
    const err = Object.assign(
      new Error("Cannot read properties of undefined (reading 'map')"),
      { digest: "ERR_DIGEST_42" },
    );

    render(<DashboardErrorBoundary error={err} reset={reset} />);

    const heading = screen.getByRole("heading", {
      name: "This page couldn't load",
    });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveFocus();

    expect(
      screen.getByText(
        "Something went wrong on our side. Try again, or go back to your dashboard.",
      ),
    ).toBeInTheDocument();

    expect(screen.getByText("ERR_DIGEST_42")).toBeInTheDocument();
    expect(
      screen.queryByText("Cannot read properties of undefined (reading 'map')"),
    ).not.toBeInTheDocument();

    const retryBtn = screen.getByRole("button", { name: "Try again" });
    fireEvent.click(retryBtn);
    expect(reset).toHaveBeenCalledTimes(1);

    const dashboardLink = screen.getByRole("link", { name: "Go to dashboard" });
    expect(dashboardLink).toHaveAttribute(
      "href",
      "/dashboard/escrow-dashboard",
    );
  });
});
