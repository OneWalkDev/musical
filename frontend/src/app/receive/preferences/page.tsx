'use client'

import { useEffect, useState } from 'react'
import { AppHeader } from '@/components/layout/AppHeader'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { IoMusicalNotes } from 'react-icons/io5'
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md'
import { apiRequest } from '@/utils/api'
import { AppFooter } from '@/components/layout/AppFooter'
import { Modal, ModalType } from '@/components/ui/Modal'

interface Genre {
  id: number
  name: string
  slug: string
}

interface ModalState {
  isOpen: boolean
  type: ModalType
  title: string
  message: string
}

const MIN_GENRE_SELECTION = 1

export default function ReceivePreferencesPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  const [genres, setGenres] = useState<Genre[]>([])
  const [selectedGenres, setSelectedGenres] = useState<number[]>([])
  const [genreSearch, setGenreSearch] = useState('')
  const [isLoadingGenres, setIsLoadingGenres] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  })

  const filteredGenres = genres.filter(genre =>
    genre.name.toLowerCase().includes(genreSearch.toLowerCase())
  )

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    const fetchData = async () => {
      try {
        const [genresRes, userGenresRes] = await Promise.all([
          apiRequest('/api/genres/'),
          apiRequest('/api/user-genres/')
        ])

        if (genresRes.ok) {
          const data = await genresRes.json()
          setGenres(data)
        }

        if (userGenresRes.ok) {
          const data = await userGenresRes.json()
          setSelectedGenres(data.map((g: Genre) => g.id))
        }
      } catch (error) {
        console.error('ジャンル取得エラー:', error)
      } finally {
        setIsLoadingGenres(false)
      }
    }

    fetchData()
  }, [isAuthenticated, router])

  const toggleGenre = (genreId: number) => {
    setSelectedGenres(prev => {
      if (prev.includes(genreId)) {
        return prev.filter(id => id !== genreId)
      }
      return [...prev, genreId]
    })
  }

  const showModal = (type: ModalType, title: string, message: string) => {
    setModal({
      isOpen: true,
      type,
      title,
      message,
    })
  }

  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedGenres.length < MIN_GENRE_SELECTION) {
      showModal(
        'error',
        '選択不足',
        `少なくとも${MIN_GENRE_SELECTION}つのジャンルを選択してください`
      )
      return
    }

    setIsSubmitting(true)
    try {
      const response = await apiRequest('/api/user-genres/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ genre_ids: selectedGenres }),
      })

      if (response.ok) {
        showModal(
          'success',
          '更新完了',
          '受け取りジャンルを更新しました'
        )
      } else {
        showModal(
          'error',
          '更新失敗',
          '更新に失敗しました。もう一度お試しください。'
        )
      }
    } catch (error) {
      console.error('ジャンル更新エラー:', error)
      showModal(
        'error',
        'エラー',
        '更新に失敗しました。もう一度お試しください。'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <AppHeader />
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        type={modal.type}
        title={modal.title}
        message={modal.message}
      />
      <main className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden bg-gradient-to-br from-[#fff1d7] via-[#ffe7f7] to-[#dff6ff] text-slate-900">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -left-16 -top-10 w-64 h-64 bg-gradient-to-br from-amber-200/70 to-pink-200/60 rounded-full blur-3xl" />
          <div className="absolute right-0 top-16 w-72 h-72 bg-gradient-to-br from-cyan-200/60 via-sky-200/50 to-emerald-200/50 rounded-full blur-3xl" />
          <div className="absolute left-1/3 -bottom-24 w-80 h-80 bg-gradient-to-br from-emerald-100/70 via-white to-amber-200/60 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl relative z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="text-center mb-8"
          >
            <div className="inline-block text-6xl text-amber-500 mb-4 drop-shadow-sm">
              <IoMusicalNotes />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              受け取るジャンルを更新
            </h1>
            <p className="text-slate-600">
              好みのジャンルを選び直して、届く曲の雰囲気を調整しよう
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/85 backdrop-blur-xl rounded-3xl p-8 border border-white/60 shadow-2xl"
          >
            {isLoadingGenres ? (
              <div className="text-center text-slate-600 py-8">読み込み中...</div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-slate-800 font-semibold">
                    好きなジャンル
                  </label>
                  <span className="text-sm text-slate-500">
                    {selectedGenres.length}個選択中
                  </span>
                </div>

                <div className="space-y-3">
                  <input
                    type="text"
                    value={genreSearch}
                    onChange={(e) => setGenreSearch(e.target.value)}
                    placeholder="ジャンルを検索..."
                    className="w-full px-4 py-2 bg-white border border-amber-100 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all duration-200 shadow-sm"
                  />

                  {selectedGenres.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedGenres.map(id => {
                        const genre = genres.find(g => g.id === id)
                        return genre ? (
                          <motion.div
                            key={genre.id}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-amber-400 via-pink-500 to-sky-500 text-white rounded-full text-sm shadow-sm"
                          >
                            <span>{genre.name}</span>
                            <button
                              type="button"
                              onClick={() => toggleGenre(genre.id)}
                              className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                            >
                              ✕
                            </button>
                          </motion.div>
                        ) : null
                      })}
                    </div>
                  )}

                  <div className="max-h-96 overflow-y-auto border border-amber-100 rounded-lg p-2 bg-white/70">
                    <div className="flex flex-col gap-2">
                      {filteredGenres.map((genre) => {
                        const isSelected = selectedGenres.includes(genre.id)
                        return (
                          <motion.button
                            key={genre.id}
                            type="button"
                            onClick={() => toggleGenre(genre.id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`
                              flex items-center gap-2 px-3 py-2.5 rounded-lg text-left
                              font-medium transition-all duration-200 text-sm
                              ${isSelected
                                ? 'bg-gradient-to-r from-amber-400 via-pink-500 to-sky-500 text-white border border-white/40 shadow-sm'
                                : 'bg-white text-slate-800 border border-amber-100 hover:shadow-sm'
                              }
                            `}
                          >
                            {isSelected ? (
                              <MdCheckBox className="text-lg flex-shrink-0" />
                            ) : (
                              <MdCheckBoxOutlineBlank className="text-lg flex-shrink-0" />
                            )}
                            <span className="break-words">{genre.name}</span>
                          </motion.button>
                        )
                      })}
                    </div>
                    {filteredGenres.length === 0 && (
                      <div className="text-slate-500 text-center py-4 text-sm">
                        該当するジャンルが見つかりません
                      </div>
                    )}
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting || selectedGenres.length < MIN_GENRE_SELECTION}
                  whileHover={!isSubmitting && selectedGenres.length >= MIN_GENRE_SELECTION ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting && selectedGenres.length >= MIN_GENRE_SELECTION ? { scale: 0.98 } : {}}
                  className="w-full py-3 bg-gradient-to-r from-amber-400 via-pink-500 to-sky-500 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? '保存中...' : '受け取るジャンルを保存'}
                </motion.button>
              </form>
            )}
          </motion.div>
        </motion.div>
      </main>
      <AppFooter />
    </>
  )
}
