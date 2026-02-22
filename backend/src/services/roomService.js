import Room from "../models/Room.js";

export async function listRooms({
  page = 1,
  limit = 10,
  search,
  minCapacity,
}) {
  const query = {};

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  if (minCapacity) {
    query.capacity = { $gte: Number(minCapacity) };
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Room.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Room.countDocuments(query),
  ]);

  return {
    items,
    total,
    page,
    pageSize: limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function createRoom(data) {
  const room = await Room.create(data);
  return room;
}

export async function updateRoom(id, data) {
  const room = await Room.findByIdAndUpdate(id, data, {
    new: true,
  });
  return room;
}

export async function deleteRoom(id) {
  await Room.findByIdAndDelete(id);
}


