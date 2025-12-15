'use client'

import { useEffect, useState } from 'react'
import { AppHeader } from '@/components/layout/AppHeader'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { IoMusicalNotes } from 'react-icons/io5'
import { FaPlay, FaPaperPlane } from 'react-icons/fa'
import { apiRequest } from '@/utils/api'
import { AppFooter } from '@/components/layout/AppFooter'

interface Genre {
  id: number
  name: string
  slug: string
}

interface SentItem {
  id: number
  sent_at: string
  track: {
    title: string
    artist: string
    url: string
    primary_genre: Genre
  }
  genres?: Genre[]
  comment?: string
}

export default function SentHistoryPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [items, setItems] = useState<SentItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [total, setTotal] = useState(0)
  const perPage = 10

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    const fetchHistory = async (pageNum: number) => {
      setIsLoading(true)
      try {
        const response = await apiRequest(`/api/sent-posts/?page=${pageNum}&per_page=${perPage}`)
        if (response.ok) {
          const data = await response.json()
          setItems(data.data || [])
          setLastPage(data.pagination?.last_page || 1)
          setTotal(data.pagination?.total || 0)
        } else {
          setItems([])
          setLastPage(1)
          setTotal(0)
        }
      } catch (error) {
        console.error('履歴取得エラー:', error)
        setItems([])
        setLastPage(1)
        setTotal(0)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHistory(page)
  }, [isAuthenticated, router, page])

  const handleOpen = (url: string) => {
    if (url) window.open(url, '_blank')
  }

  return (
    <>
      <AppHeader />
      <main className="relative min-h-screen px-4 py-12 bg-gradient-to-br from-[#fff1d7] via-[#ffe7f7] to-[#dff6ff] overflow-hidden text-slate-900">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -left-16 -top-10 w-64 h-64 bg-gradient-to-br from-amber-200/70 to-pink-200/60 rounded-full blur-3xl" />
          <div className="absolute right-0 top-16 w-72 h-72 bg-gradient-to-br from-cyan-200/60 via-sky-200/50 to-emerald-200/50 rounded-full blur-3xl" />
          <div className="absolute left-1/3 -bottom-24 w-80 h-80 bg-gradient-to-br from-emerald-100/70 via-white to-amber-200/60 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/80 border border-pink-100 text-pink-700 shadow-sm">
              <FaPaperPlane />
              送信履歴
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-4">
              これまで送った曲
            </h1>
            <p className="text-slate-600 mt-2">あなたが誰かに送った曲の一覧</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/85 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl p-6"
          >
            {isLoading ? (
              <div className="text-center text-slate-600 py-8">読み込み中...</div>
            ) : items.length === 0 ? (
              <div className="text-center text-slate-600 py-8">
                まだ送った曲がありません。
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl border border-white/60 bg-white/80 shadow-sm"
                  >
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 text-white flex items-center justify-center text-2xl shadow-md">
                        <IoMusicalNotes />
                      </div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-lg font-semibold text-slate-900">{item.track.title}</p>
                        <span className="text-sm text-slate-500">/ {item.track.artist}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(item.genres && item.genres.length ? item.genres : [item.track.primary_genre]).map((genre) => (
                          <span
                            key={genre.id}
                            className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100 border border-white/60 text-xs font-semibold text-slate-800"
                          >
                            {genre.name}
                          </span>
                        ))}
                      </div>
                      {item.comment && (
                        <p className="text-sm text-slate-600 bg-white/80 border border-white/60 rounded-lg px-3 py-2">
                          {item.comment}
                        </p>
                      )}
                      <p className="text-xs text-slate-400">
                        送信日時: {new Date(item.sent_at).toLocaleString('ja-JP')}
                      </p>
                    </div>
                    <div className="flex-shrink-0 flex gap-2">
                      <button
                        onClick={() => handleOpen(item.track.url)}
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                      >
                        <FaPlay />
                        再生
                      </button>
                    </div>
                  </motion.div>
                ))}

                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm text-slate-600">
                    全{total}件 / {page}ページ目
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="px-4 py-2 rounded-full bg-white text-slate-800 border border-pink-100 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md transition-all text-sm font-semibold"
                    >
                      前へ
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                      disabled={page >= lastPage}
                      className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md transition-all text-sm font-semibold"
                    >
                      次へ
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <AppFooter />
    </>
  )
}
