import React, { useState, useEffect } from "react";
import { roomApi } from "../services/roomApi.js";
import { bookingApi } from "../services/bookingApi.js";
import { RoomCard } from "../components/RoomCard.jsx";
import { Pagination } from "../components/Pagination.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export function RoomsPage() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [capacityFilter, setCapacityFilter] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    loadRooms();
  }, [currentPage, searchQuery, capacityFilter]);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 9,
        ...(searchQuery && { search: searchQuery }),
        ...(capacityFilter && { minCapacity: parseInt(capacityFilter) }),
      };
      const response = await roomApi.list(params);
      setRooms(response.items || []);
      setTotalPages(response.totalPages || 1);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRoom) return;

    try {
      await bookingApi.create({
        roomId: selectedRoom._id,
        startTime: bookingForm.startTime,
        endTime: bookingForm.endTime,
      });
      alert("Booking created successfully!");
      setShowBookingModal(false);
      setSelectedRoom(null);
      setBookingForm({ startTime: "", endTime: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create booking");
    }
  };

  return (
    <div className="px-8 py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all text-sm shadow-sm"
            />
          </div>
          <select
            value={capacityFilter}
            onChange={(e) => {
              setCapacityFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all text-sm shadow-sm"
          >
            <option value="">All capacities</option>
            <option value="2">2+ people</option>
            <option value="5">5+ people</option>
            <option value="10">10+ people</option>
            <option value="20">20+ people</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

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
          <h3 className="text-lg font-medium text-gray-900 mb-2 tracking-tight">No rooms found</h3>
          <p className="text-gray-500 text-sm font-light">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {rooms.map((room) => (
              <RoomCard
                key={room._id}
                room={room}
                onBook={() => {
                  setSelectedRoom(room);
                  setShowBookingModal(true);
                }}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onChange={setCurrentPage}
            />
          )}
        </>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedRoom && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border border-gray-200 p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-light text-gray-900 tracking-tight">
                Book {selectedRoom.name}
              </h2>
              <button
                onClick={() => {
                  setShowBookingModal(false);
                  setSelectedRoom(null);
                  setBookingForm({ startTime: "", endTime: "" });
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleBookingSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2 tracking-wide uppercase">
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={bookingForm.startTime}
                  onChange={(e) =>
                    setBookingForm({ ...bookingForm, startTime: e.target.value })
                  }
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2 tracking-wide uppercase">
                  End Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={bookingForm.endTime}
                  onChange={(e) =>
                    setBookingForm({ ...bookingForm, endTime: e.target.value })
                  }
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all text-sm"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowBookingModal(false);
                    setSelectedRoom(null);
                    setBookingForm({ startTime: "", endTime: "" });
                  }}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-all text-sm tracking-wide"
                >
                  Book Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

