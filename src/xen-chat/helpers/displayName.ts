export default function displayName(
  username: string | undefined,
  nickname: string | null | undefined,
) {
  return nickname ? `${username} (${nickname})` : nickname
}
