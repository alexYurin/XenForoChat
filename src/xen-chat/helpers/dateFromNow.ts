import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

export default function dateFromNow(date: Date) {
  dayjs.extend(relativeTime)

  return dayjs(date).fromNow(true)
}
