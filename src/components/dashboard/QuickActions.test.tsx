import { render, screen } from "@testing-library/react";
import { QuickActions } from "./QuickActions";

describe("QuickActions (#783)", () => {
  it("renders guest cards as real internal links with honest titles and /help destination", () => {
    render(<QuickActions userRole="guest" />);

    expect(screen.getByRole("link", { name: /New booking/i })).toHaveAttribute(
      "href",
      "/rent",
    );
    expect(screen.getByRole("link", { name: /My profile/i })).toHaveAttribute(
      "href",
      "/dashboard/profile",
    );
    expect(screen.getByRole("link", { name: /My escrows/i })).toHaveAttribute(
      "href",
      "/dashboard/escrow",
    );
    expect(
      screen.getByRole("link", { name: /Notifications/i }),
    ).toHaveAttribute("href", "/dashboard/notifications");
    expect(screen.getByRole("link", { name: /Help/i })).toHaveAttribute(
      "href",
      "/help",
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders admin cards pointing to /dashboard/escrow, /dashboard/users, and /dashboard/profile/security", () => {
    render(<QuickActions userRole="admin" />);

    expect(
      screen.getByRole("link", { name: /Manage escrows/i }),
    ).toHaveAttribute("href", "/dashboard/escrow");
    expect(screen.getByRole("link", { name: /Your account/i })).toHaveAttribute(
      "href",
      "/dashboard/users",
    );
    expect(
      screen.getByRole("link", { name: /Account security/i }),
    ).toHaveAttribute("href", "/dashboard/profile/security");
  });
});
