import React from "react";

export function RoomCard({ room, onBook, isAdmin, onEdit, onDelete }) {
  return (
    <div className="flex flex-col justify-between bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3 tracking-tight">
          {room.name}
        </h3>
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="text-sm font-light text-gray-500">{room.capacity} people</span>
        </div>
        {room.equipment?.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {room.equipment.slice(0, 3).map((eq, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-light border border-gray-200"
                >
                  {eq}
                </span>
              ))}
              {room.equipment.length > 3 && (
                <span className="px-2.5 py-1 bg-gray-50 text-gray-500 rounded-full text-xs font-light border border-gray-200">
                  +{room.equipment.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
        {room.description && (
          <p className="mt-2 text-sm text-gray-600 font-light line-clamp-2 leading-relaxed">
            {room.description}
          </p>
        )}
      </div>
      <div className="mt-6">
        {onBook && (
          <button
            onClick={() => onBook(room)}
            className="w-full px-4 py-2.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-all text-sm tracking-wide"
          >
            Book Room
          </button>
        )}
        {isAdmin && (
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => onEdit(room)}
              className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 text-sm font-medium rounded-xl transition-all border border-gray-200"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(room)}
              className="flex-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-medium rounded-xl transition-all border border-red-200"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


