import { apiRequest } from '@/utils/api'

export const getTodayReceivedPostId = async (): Promise<number | null> => {
  try {
    const response = await apiRequest('/api/today-received-post/')
    if (!response.ok) return null

    const data = await response.json()
    if (data?.has_received && data?.post?.id) {
      return data.post.id
    }
  } catch (error) {
    console.error('Failed to fetch today received post:', error)
  }

  return null
}
