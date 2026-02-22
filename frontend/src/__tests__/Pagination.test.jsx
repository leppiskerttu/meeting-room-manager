import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "../components/Pagination.jsx";

describe("Pagination", () => {
  it("should render pagination controls", () => {
    const onChange = vi.fn();
    render(<Pagination page={1} totalPages={5} onChange={onChange} />);

    expect(screen.getByText("Page 1 of 5")).toBeInTheDocument();
    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("should not render when totalPages is 1", () => {
    const onChange = vi.fn();
    const { container } = render(
      <Pagination page={1} totalPages={1} onChange={onChange} />
    );

    expect(container.firstChild).toBeNull();
  });

  it("should disable Previous button on first page", () => {
    const onChange = vi.fn();
    render(<Pagination page={1} totalPages={5} onChange={onChange} />);

    const prevButton = screen.getByText("Previous");
    expect(prevButton).toBeDisabled();
  });

  it("should disable Next button on last page", () => {
    const onChange = vi.fn();
    render(<Pagination page={5} totalPages={5} onChange={onChange} />);

    const nextButton = screen.getByText("Next");
    expect(nextButton).toBeDisabled();
  });

  it("should call onChange with previous page when Previous is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Pagination page={3} totalPages={5} onChange={onChange} />);

    const prevButton = screen.getByText("Previous");
    await user.click(prevButton);

    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("should call onChange with next page when Next is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Pagination page={2} totalPages={5} onChange={onChange} />);

    const nextButton = screen.getByText("Next");
    await user.click(nextButton);

    expect(onChange).toHaveBeenCalledWith(3);
  });

  it("should enable both buttons on middle pages", () => {
    const onChange = vi.fn();
    render(<Pagination page={3} totalPages={5} onChange={onChange} />);

    const prevButton = screen.getByText("Previous");
    const nextButton = screen.getByText("Next");

    expect(prevButton).not.toBeDisabled();
    expect(nextButton).not.toBeDisabled();
  });
});

