import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'

export default function dateFromNow(date: Date, withTime?: boolean) {
  dayjs.extend(relativeTime)
  dayjs.extend(duration)

  const diff = dayjs.duration(dayjs().diff(date))

  if (diff.days() > 1) {
    return dayjs(date).format(withTime ? 'MMM D, HH:MM' : 'MMM D')
  }

  return dayjs(date).fromNow(true)
}
