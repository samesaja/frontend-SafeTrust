import { render, screen } from "@testing-library/react";
import { DashboardPageSkeleton } from "./DashboardPageSkeleton";

describe("DashboardPageSkeleton (#781)", () => {
  it("renders overview variant with 4 stat tiles and 1 table block", () => {
    render(
      <DashboardPageSkeleton
        variant="overview"
        label="Loading escrow dashboard"
      />,
    );

    const root = screen.getByRole("status", {
      name: "Loading escrow dashboard",
    });
    expect(root).toHaveAttribute("aria-busy", "true");
    expect(screen.getAllByTestId("skeleton-stat-tile")).toHaveLength(4);
    expect(screen.getByTestId("skeleton-table-block")).toBeInTheDocument();
  });

  it("renders table variant with 6 row bars", () => {
    render(
      <DashboardPageSkeleton variant="table" label="Loading apartments" />,
    );

    expect(
      screen.getByRole("status", { name: "Loading apartments" }),
    ).toBeInTheDocument();
    expect(screen.getAllByTestId("skeleton-table-row")).toHaveLength(6);
  });

  it("renders form variant with 5 label and input pairs", () => {
    render(<DashboardPageSkeleton variant="form" label="Loading profile" />);

    expect(
      screen.getByRole("status", { name: "Loading profile" }),
    ).toBeInTheDocument();
    expect(screen.getAllByTestId("skeleton-form-field")).toHaveLength(5);
  });

  it("renders list variant with 8 avatar and text rows", () => {
    render(<DashboardPageSkeleton variant="list" label="Loading messages" />);

    expect(
      screen.getByRole("status", { name: "Loading messages" }),
    ).toBeInTheDocument();
    expect(screen.getAllByTestId("skeleton-list-row")).toHaveLength(8);
  });
});
