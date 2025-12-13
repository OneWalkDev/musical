const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const resolveUrl = (url: string): string => {
  if (/^https?:\/\//.test(url)) return url
  return `${API_BASE}${url}`
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
