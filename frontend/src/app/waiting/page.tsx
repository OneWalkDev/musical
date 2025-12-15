'use client'

import { AppHeader } from '@/components/layout/AppHeader'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { IoMusicalNotes, IoRefresh } from 'react-icons/io5'
import { apiRequest } from '@/utils/api'
import { AppFooter } from '@/components/layout/AppFooter'

export default function WaitingPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    // 初回チェック
    checkReceivedPost()
  }, [isAuthenticated, router])

  const checkReceivedPost = async () => {
    setIsChecking(true)
    try {
      const response = await apiRequest('/api/check-receive/', {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        if (data.has_received) {
          // 受け取った曲がある場合、受信画面にリダイレクト
          router.push(`/receive?postId=${data.post.id}`)
        }
      }
    } catch (error) {
      console.error('受信チェックエラー:', error)
    } finally {
      setIsChecking(false)
    }
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md relative z-10"
        >
          {/* アイコンとタイトル */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="text-center mb-8"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1
              }}
              className="inline-block text-6xl text-amber-500 mb-4 drop-shadow-sm"
            >
              <IoMusicalNotes />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              曲を交換中...
            </h1>
            <p className="text-slate-600">
              誰かがあなたに曲を送ってくれるまで少々お待ちください
            </p>
          </motion.div>

          {/* メッセージカード */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/85 backdrop-blur-xl rounded-3xl p-8 border border-white/60 shadow-2xl"
          >
            <div className="space-y-6">
              {/* 説明 */}
              <div className="text-center space-y-4">
                <div className="text-slate-800 space-y-2">
                  <p className="text-lg">
                    あなたの曲は正常に送信されました！
                  </p>
                  <p className="text-sm text-slate-600">
                    他のユーザーが曲を投稿すると、その曲があなたに届きます。
                  </p>
                </div>

                {/* ローディングアニメーション */}
                <div className="flex justify-center items-center gap-2 py-4">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                    className="w-3 h-3 bg-amber-400 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    className="w-3 h-3 bg-pink-400 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    className="w-3 h-3 bg-sky-400 rounded-full"
                  />
                </div>
              </div>

              {/* 更新ボタン */}
              <motion.button
                onClick={checkReceivedPost}
                disabled={isChecking}
                whileHover={!isChecking ? { scale: 1.02 } : {}}
                whileTap={!isChecking ? { scale: 0.98 } : {}}
                className="w-full py-3 bg-gradient-to-r from-amber-400 via-pink-500 to-sky-500 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <IoRefresh className={`text-xl ${isChecking ? 'animate-spin' : ''}`} />
                {isChecking ? '確認中...' : '曲が届いたか確認する'}
              </motion.button>

              {/* ホームに戻るボタン */}
              <motion.button
                onClick={() => router.push('/')}
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
