'use client'

import { AppHeader } from '@/components/layout/AppHeader'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { motion } from 'motion/react'
import { IoMusicalNotes } from 'react-icons/io5'
import { FaPlay } from 'react-icons/fa'
import { apiRequest } from '@/utils/api'
import { AppFooter } from '@/components/layout/AppFooter'

interface Genre {
  id: number
  name: string
  slug: string
}

interface Post {
  id: number
  user: number  // ユーザーID
  username: string  // ユーザー名
  track: {
    id: number
    title: string
    artist: string
    url: string
    primary_genre: Genre
  }
  genres: Genre[]  // すべてのジャンル
  comment: string
  created_at: string
}

function ReceiveContent() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const postId = searchParams.get('postId')

  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const [isOwnPost, setIsOwnPost] = useState(false)

  // YouTubeのURLからビデオIDを抽出
  const extractYouTubeId = (url: string): string | null => {
    try {
      const urlObj = new URL(url)
      const hostname = urlObj.hostname.replace(/^www\./, '')

      // youtu.be/<id>
      if (hostname === 'youtu.be') {
        return urlObj.pathname.split('/').filter(Boolean)[0] || null
      }

      // youtube.com/watch?v=<id>
      if (hostname === 'youtube.com' && urlObj.pathname === '/watch') {
        return urlObj.searchParams.get('v')
      }

      return null
    } catch {
      return null
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    const fetchPost = async () => {
      if (!postId) {
        router.push('/')
        return
      }

      try {
        const response = await apiRequest(`/api/posts/${postId}/`)

        if (response.ok) {
          const data = await response.json()
          setPost(data)

          // 自分の投稿かどうかチェック
          if (user && data.user === user.id) {
            setIsOwnPost(true)
          }

          // 1秒後にコンテンツ表示アニメーション開始
          setTimeout(() => {
            setShowContent(true)
          }, 1000)
        } else {
          router.push('/')
        }
      } catch (error) {
        console.error('投稿取得エラー:', error)
        router.push('/')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [isAuthenticated, postId, router])

  const handlePlayMusic = () => {
    if (post?.track.url) {
      window.open(post.track.url, '_blank')
    }
  }

  if (isLoading) {
    return (
      <>
        <AppHeader />
        <main className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-[#fff1d7] via-[#ffe7f7] to-[#dff6ff]">
          <div className="text-slate-700 text-xl">読み込み中...</div>
        </main>
      </>
    )
  }

  if (!post) {
    return null
  }

  return (
    <>
      <AppHeader />
      <main className="relative flex items-center justify-center min-h-screen px-4 py-12 overflow-hidden bg-gradient-to-br from-[#fff1d7] via-[#ffe7f7] to-[#dff6ff] text-slate-900">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -left-16 -top-10 w-64 h-64 bg-gradient-to-br from-amber-200/70 to-pink-200/60 rounded-full blur-3xl" />
          <div className="absolute right-0 top-16 w-72 h-72 bg-gradient-to-br from-cyan-200/60 via-sky-200/50 to-emerald-200/50 rounded-full blur-3xl" />
          <div className="absolute left-1/3 -bottom-24 w-80 h-80 bg-gradient-to-br from-emerald-100/70 via-white to-amber-200/60 rounded-full blur-3xl" />
        </div>
        {/* 下から飛んでくるエフェクト */}
        <motion.div
          initial={{ y: 1000, opacity: 0, scale: 0.5 }}
          animate={showContent ? { y: 0, opacity: 1, scale: 1 } : {}}
          transition={{
            duration: 1.5,
            ease: "easeOut",
            type: "spring",
            damping: 15
          }}
          className="w-full max-w-2xl relative z-10"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={showContent ? { opacity: 1 } : {}}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-center mb-8"
          >
            <motion.div
              animate={showContent ? {
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              } : {}}
              transition={{
                delay: 1,
                duration: 1,
                ease: "easeInOut"
              }}
              className="inline-block text-8xl text-amber-500 mb-4 drop-shadow-sm"
            >
              <IoMusicalNotes />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
              {isOwnPost ? '注意' : '曲が届きました！'}
            </h1>
            <p className="text-slate-600">
              {isOwnPost ? 'これはあなた自身の投稿です' : '誰かがあなたに曲を送ってくれました。また明日曲を送りましょう！'}
            </p>
          </motion.div>

          {/* 自分の投稿の警告 */}
          {isOwnPost && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={showContent ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.4, duration: 0.5 }}
              className="mb-6 p-6 bg-amber-100 border-2 border-amber-200 rounded-xl"
            >
              <p className="text-amber-800 font-medium text-center">
                ⚠️ この曲はあなた自身が投稿したものです。
                <br />
                自分の投稿は受け取ることができません。
              </p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={showContent ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="bg-white/85 backdrop-blur-xl rounded-3xl p-8 border border-white/60 shadow-2xl"
          >
            <div className="space-y-6">
              {/* 曲情報 */}
              <div className="text-center space-y-4">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">
                    {post.track.title}
                  </h2>
                  <p className="text-xl text-slate-600">
                    {post.track.artist}
                  </p>
                </div>

                {/* 送信者情報 */}
                <div className="text-slate-600 text-sm">
                  <span className="font-medium">{post.username}</span> さんから届きました
                </div>

                {/* ジャンルタグ（複数表示） */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {post.genres && post.genres.length > 0 ? (
                    post.genres.map((genre) => (
                      <div
                        key={genre.id}
                        className="px-4 py-2 bg-gradient-to-r from-amber-100 via-pink-100 to-sky-100 border border-white/60 rounded-full shadow-sm"
                      >
                        <span className="text-slate-800 text-sm">
                          {genre.name}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 bg-gradient-to-r from-amber-100 via-pink-100 to-sky-100 border border-white/60 rounded-full shadow-sm">
                      <span className="text-slate-800 text-sm">
                        {post.track.primary_genre.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* YouTube埋め込み */}
              {extractYouTubeId(post.track.url) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={showContent ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 1.7, duration: 0.5 }}
                  className="w-full aspect-video rounded-lg overflow-hidden border-2 border-white/20 shadow-xl"
                >
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${extractYouTubeId(post.track.url)}?autoplay=1&mute=1`}
                    title={post.track.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </motion.div>
              )}

              {/* コメント */}
              {post.comment && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={showContent ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 1.9, duration: 0.5 }}
                  className="bg-white/80 rounded-lg p-6 border border-white/60 shadow-sm"
                >
                  <p className="text-slate-600 text-sm mb-2">メッセージ:</p>
                  <p className="text-slate-900 text-lg">{post.comment}</p>
                </motion.div>
              )}

              {/* YouTubeで開くボタン */}
              <motion.button
                onClick={handlePlayMusic}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={showContent ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 2.1, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-4 bg-gradient-to-r from-amber-400 via-pink-500 to-sky-500 text-white rounded-xl font-semibold text-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                <FaPlay className="text-2xl" />
                YouTubeで開く
              </motion.button>

              {/* ホームに戻るボタン */}
              <motion.button
                onClick={() => router.push('/')}
                initial={{ opacity: 0 }}
                animate={showContent ? { opacity: 1 } : {}}
                transition={{ delay: 2.2, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-white text-slate-900 rounded-lg font-semibold border border-amber-100 hover:shadow-md transition-all duration-300"
              >
                ホームに戻る
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </main>
      <AppFooter />
    </>
  )
}

export default function Receive() {
  return (
    <Suspense fallback={
      <>
        <AppHeader />
        <main className="flex items-center justify-center min-h-screen px-4">
          <div className="text-white text-xl">読み込み中...</div>
        </main>
      </>
    }>
      <ReceiveContent />
    </Suspense>
  )
}
