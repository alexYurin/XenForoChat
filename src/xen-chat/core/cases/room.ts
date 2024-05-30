import { Room } from '@app/core/domain'
import { RoomModelType } from '../domain/Room'

export function updateRoom(room: Room, properties: Partial<RoomModelType>) {
  return new Room({
    ...room.model,
    ...properties,
  })
}

export function findRoomById(roomId: number, rooms: Room[] | null) {
  return rooms?.find(room => room.model.id === roomId) || null
}

export function modifyRoomsByRoom(
  rooms: Room[] | null,
  modifierRoom: Room,
  options?: { modifier: 'update' | 'add' | 'remove'; addToStart?: boolean },
) {
  const defineRooms = rooms || []

  if (options?.modifier === 'add') {
    return options?.addToStart
      ? [modifierRoom, ...defineRooms]
      : [...defineRooms, modifierRoom]
  }

  if (options?.modifier === 'remove') {
    return defineRooms.filter(room => room.model.id !== modifierRoom.model.id)
  }

  return defineRooms.map(room =>
    room.model.id === modifierRoom.model.id ? modifierRoom : room,
  )
}

export function mergeRooms(
  currentRooms: Room[] | null,
  newRooms: Room[],
  options: { mergeReverse?: boolean },
) {
  return options.mergeReverse
    ? [...newRooms, currentRooms]
    : [...(currentRooms || []), ...newRooms]
}
