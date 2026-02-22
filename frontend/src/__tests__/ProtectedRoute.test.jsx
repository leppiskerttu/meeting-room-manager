import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute.jsx";

// Mock AuthContext
const mockUseAuth = vi.fn();
vi.mock("../context/AuthContext.jsx", () => ({
  useAuth: () => mockUseAuth(),
}));

describe("ProtectedRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render children when user is authenticated", () => {
    mockUseAuth.mockReturnValue({
      user: { id: "1", email: "test@example.com", role: "USER" },
      loading: false,
      isAdmin: false,
    });

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("should show loading when loading is true", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
      isAdmin: false,
    });

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("should redirect to login when user is not authenticated", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      isAdmin: false,
    });

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("should allow admin access when adminOnly is true and user is admin", () => {
    mockUseAuth.mockReturnValue({
      user: { id: "1", email: "admin@example.com", role: "ADMIN" },
      loading: false,
      isAdmin: true,
    });

    render(
      <BrowserRouter>
        <ProtectedRoute adminOnly>
          <div>Admin Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText("Admin Content")).toBeInTheDocument();
  });

  it("should redirect non-admin users when adminOnly is true", () => {
    mockUseAuth.mockReturnValue({
      user: { id: "1", email: "user@example.com", role: "USER" },
      loading: false,
      isAdmin: false,
    });

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <ProtectedRoute adminOnly>
          <div>Admin Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.queryByText("Admin Content")).not.toBeInTheDocument();
  });
});
