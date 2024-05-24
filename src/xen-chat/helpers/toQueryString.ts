export default function toQueryString(params: Record<string, any>) {
  return new URLSearchParams(params).toString()
}
