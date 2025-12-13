const resolveBaseUrl = (): string => {
  const envBase = process.env.NEXT_PUBLIC_API_URL
  if (envBase) return envBase
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin
  }
  return ''
}

const resolveUrl = (url: string): string => {
  if (/^https?:\/\//.test(url)) return url
  return `${resolveBaseUrl()}${url}`
}

export const getAuthHeaders = (): HeadersInit => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  }
}

export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  return fetch(resolveUrl(url), {
    ...options,
    headers: {
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
}
