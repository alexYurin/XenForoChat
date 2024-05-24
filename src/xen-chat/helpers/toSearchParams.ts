export default function toSearchParams(data: Record<string, any>) {
  const params = new URLSearchParams()

  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      // value.forEach(value => params.append(key, value.toString()))
      params.append(key, value.toString())
    } else if (value !== undefined && value !== null) {
      params.append(key, value.toString())
    }
  })

  return params
}
