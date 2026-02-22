import React from "react";

export function RoomCard({ room, onBook, isAdmin, onEdit, onDelete }) {
  return (
    <div className="flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">
          {room.name}
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Capacity: <span className="font-medium">{room.capacity}</span>
        </p>
        {room.equipment?.length > 0 && (
          <p className="mt-1 text-xs text-slate-500">
            Equipment:{" "}
            <span className="font-medium">
              {room.equipment.join(", ")}
            </span>
          </p>
        )}
        {room.description && (
          <p className="mt-2 text-xs text-slate-600">
            {room.description}
          </p>
        )}
      </div>
      <div className="mt-4 flex items-center gap-2">
        {onBook && (
          <button
            onClick={() => onBook(room)}
            className="flex-1 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
          >
            Book
          </button>
        )}
        {isAdmin && (
          <>
            <button
              onClick={() => onEdit(room)}
              className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(room)}
              className="rounded-md border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}


