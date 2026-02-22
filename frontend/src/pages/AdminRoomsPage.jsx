import React, { useState, useEffect } from "react";
import { roomApi } from "../services/roomApi.js";

export function AdminRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    description: "",
    equipment: "",
  });

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const response = await roomApi.list({ page: 1, limit: 100 });
      setRooms(response.items || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const roomData = {
        ...formData,
        capacity: parseInt(formData.capacity),
        equipment: formData.equipment
          .split(",")
          .map((e) => e.trim())
          .filter((e) => e),
      };

      if (editingRoom) {
        await roomApi.update(editingRoom._id, roomData);
      } else {
        await roomApi.create(roomData);
      }

      alert(`Room ${editingRoom ? "updated" : "created"} successfully!`);
      setShowModal(false);
      setEditingRoom(null);
      setFormData({ name: "", capacity: "", description: "", equipment: "" });
      loadRooms();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save room");
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      capacity: room.capacity.toString(),
      description: room.description || "",
      equipment: room.equipment?.join(", ") || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (roomId) => {
    if (!confirm("Are you sure you want to delete this room?")) return;

    try {
      await roomApi.remove(roomId);
      alert("Room deleted successfully");
      loadRooms();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete room");
    }
  };

  return (
    <div className="px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-light text-gray-900 tracking-tight mb-2">Manage Rooms</h1>
            <p className="text-gray-500 text-sm font-light">Create, edit, and delete meeting rooms</p>
          </div>
          <button
            onClick={() => {
              setEditingRoom(null);
              setFormData({ name: "", capacity: "", description: "", equipment: "" });
              setShowModal(true);
            }}
            className="px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all text-sm tracking-wide flex items-center gap-2 shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
            Add New Room
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-gray-900"></div>
            <p className="mt-6 text-gray-500 text-sm font-light">Loading rooms...</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2 tracking-tight">No rooms yet</h3>
            <p className="text-gray-500 text-sm font-light mb-6">Create your first meeting room to get started</p>
            <button
              onClick={() => {
                setEditingRoom(null);
                setFormData({ name: "", capacity: "", description: "", equipment: "" });
                setShowModal(true);
              }}
              className="px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-all text-sm tracking-wide shadow-sm"
            >
              Create First Room
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div
                key={room._id}
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2 tracking-tight">
                      {room.name}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="text-sm font-light text-gray-500">{room.capacity} people</span>
                    </div>
                  </div>
                </div>

                {room.description && (
                  <p className="text-gray-600 mb-4 text-sm font-light line-clamp-2 leading-relaxed">
                    {room.description}
                  </p>
                )}

                {room.equipment && room.equipment.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {room.equipment.map((eq, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-light border border-gray-200"
                        >
                          {eq}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => handleEdit(room)}
                    className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-xl transition-all border border-gray-200 flex items-center justify-center gap-2 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(room._id)}
                    className="flex-1 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-medium rounded-xl transition-all border border-red-200 flex items-center justify-center gap-2 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border border-gray-200 p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-light text-gray-900 tracking-tight">
                {editingRoom ? "Edit Room" : "Create New Room"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingRoom(null);
                  setFormData({
                    name: "",
                    capacity: "",
                    description: "",
                    equipment: "",
                  });
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2 tracking-wide uppercase">
                  Room Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all text-sm"
                  placeholder="e.g. Conference Room A"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2 tracking-wide uppercase">
                  Capacity
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({ ...formData, capacity: e.target.value })
                  }
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all text-sm"
                  placeholder="e.g. 10"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2 tracking-wide uppercase">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all resize-none text-sm"
                  rows="3"
                  placeholder="Room description..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2 tracking-wide uppercase">
                  Equipment (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.equipment}
                  onChange={(e) =>
                    setFormData({ ...formData, equipment: e.target.value })
                  }
                  placeholder="e.g. Projector, Whiteboard, TV"
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all text-sm"
                />
                <p className="mt-1.5 text-xs text-gray-500 font-light">Separate multiple items with commas</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingRoom(null);
                    setFormData({
                      name: "",
                      capacity: "",
                      description: "",
                      equipment: "",
                    });
                  }}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-all text-sm tracking-wide"
                >
                  {editingRoom ? "Update Room" : "Create Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
