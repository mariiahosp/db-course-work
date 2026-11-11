export async function readError(response: Response) {
  const body = (await response.json().catch(() => null)) as { message?: string | string[] } | null
  const message = body?.message
  if (typeof message === 'string') return message
  if (Array.isArray(message) && typeof message[0] === 'string') return message[0]
  return `Request failed: ${response.status}`
}
