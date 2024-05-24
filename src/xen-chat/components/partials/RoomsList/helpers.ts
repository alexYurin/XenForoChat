import dayjs from 'dayjs'
import { Room } from '@app/core/domain'

export const sortRoomsByDate = (rooms: Room[]) => {
  return rooms.sort((a, b) =>
    dayjs(b.model.lastMessageDate).isAfter(dayjs(a.model.lastMessageDate))
      ? 1
      : -1,
  )
}
