import { describe, it, expect, vi, beforeEach } from "vitest";
import { roomApi } from "../services/roomApi.js";
import { httpClient } from "../services/httpClient.js";

vi.mock("../services/httpClient.js", () => ({
  httpClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("roomApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("list", () => {
    it("should fetch rooms with params", async () => {
      const mockResponse = {
        data: {
          items: [{ _id: "1", name: "Room 1", capacity: 10 }],
          total: 1,
          page: 1,
          totalPages: 1,
        },
      };

      httpClient.get.mockResolvedValue(mockResponse);

      const result = await roomApi.list({ page: 1, limit: 10 });

      expect(httpClient.get).toHaveBeenCalledWith("/rooms", {
        params: { page: 1, limit: 10 },
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("create", () => {
    it("should create a room", async () => {
      const mockRoom = { name: "New Room", capacity: 15 };
      const mockResponse = { data: { _id: "1", ...mockRoom } };

      httpClient.post.mockResolvedValue(mockResponse);

      const result = await roomApi.create(mockRoom);

      expect(httpClient.post).toHaveBeenCalledWith("/rooms", mockRoom);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("update", () => {
    it("should update a room", async () => {
      const roomId = "1";
      const updates = { name: "Updated Room" };
      const mockResponse = { data: { _id: roomId, ...updates } };

      httpClient.put.mockResolvedValue(mockResponse);

      const result = await roomApi.update(roomId, updates);

      expect(httpClient.put).toHaveBeenCalledWith(`/rooms/${roomId}`, updates);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("remove", () => {
    it("should delete a room", async () => {
      const roomId = "1";
      httpClient.delete.mockResolvedValue({});

      await roomApi.remove(roomId);

      expect(httpClient.delete).toHaveBeenCalledWith(`/rooms/${roomId}`);
    });
  });
});

