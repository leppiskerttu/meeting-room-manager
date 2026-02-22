import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RoomCard } from "../components/RoomCard.jsx";

describe("RoomCard", () => {
  const mockRoom = {
    _id: "1",
    name: "Test Room",
    capacity: 10,
    description: "A test room",
    equipment: ["Projector", "Whiteboard"],
  };

  it("should render room information", () => {
    render(<RoomCard room={mockRoom} />);

    expect(screen.getByText("Test Room")).toBeInTheDocument();
    expect(screen.getByText(/Capacity:/)).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("A test room")).toBeInTheDocument();
    expect(screen.getByText(/Projector, Whiteboard/)).toBeInTheDocument();
  });

  it("should call onBook when Book button is clicked", async () => {
    const user = userEvent.setup();
    const onBook = vi.fn();

    render(<RoomCard room={mockRoom} onBook={onBook} />);

    const bookButton = screen.getByText("Book");
    await user.click(bookButton);

    expect(onBook).toHaveBeenCalledWith(mockRoom);
  });

  it("should not show Book button if onBook is not provided", () => {
    render(<RoomCard room={mockRoom} />);

    expect(screen.queryByText("Book")).not.toBeInTheDocument();
  });

  it("should show admin buttons when isAdmin is true", () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <RoomCard
        room={mockRoom}
        isAdmin={true}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("should call onEdit when Edit button is clicked", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();

    render(
      <RoomCard room={mockRoom} isAdmin={true} onEdit={onEdit} />
    );

    const editButton = screen.getByText("Edit");
    await user.click(editButton);

    expect(onEdit).toHaveBeenCalledWith(mockRoom);
  });

  it("should call onDelete when Delete button is clicked", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(
      <RoomCard room={mockRoom} isAdmin={true} onDelete={onDelete} />
    );

    const deleteButton = screen.getByText("Delete");
    await user.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith(mockRoom);
  });

  it("should not show equipment if room has no equipment", () => {
    const roomWithoutEquipment = { ...mockRoom, equipment: [] };
    render(<RoomCard room={roomWithoutEquipment} />);

    expect(screen.queryByText(/Equipment:/)).not.toBeInTheDocument();
  });

  it("should not show description if room has no description", () => {
    const roomWithoutDescription = { ...mockRoom, description: "" };
    render(<RoomCard room={roomWithoutDescription} />);

    expect(screen.queryByText(/A test room/)).not.toBeInTheDocument();
  });
});

