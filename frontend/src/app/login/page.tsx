'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { AppHeader } from '@/components/layout/AppHeader'
import { IoMusicalNotes, IoLockClosed, IoPerson } from 'react-icons/io5'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { AppFooter } from '@/components/layout/AppFooter'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { login, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/music")
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(username, password)
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ログインに失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <AppHeader />
      <main className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden bg-gradient-to-br from-[#fff1d7] via-[#ffe7f7] to-[#dff6ff] text-slate-900">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -left-16 -top-10 w-64 h-64 bg-gradient-to-br from-amber-200/70 to-pink-200/60 rounded-full blur-3xl" />
          <div className="absolute right-0 top-16 w-72 h-72 bg-gradient-to-br from-cyan-200/60 via-sky-200/50 to-emerald-200/50 rounded-full blur-3xl" />
          <div className="absolute left-1/3 -bottom-24 w-80 h-80 bg-gradient-to-br from-emerald-100/70 via-white to-amber-200/60 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(249,115,22,0.14),transparent_38%),radial-gradient(circle_at_78%_10%,rgba(14,165,233,0.14),transparent_36%),radial-gradient(circle_at_50%_70%,rgba(16,185,129,0.12),transparent_42%)]" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Logo Section */}
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
              Musical
            </h1>
            <p className="text-slate-600">ログインして今日の1曲を交換しよう</p>
          </motion.div>

          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/85 backdrop-blur-xl rounded-3xl p-8 border border-white/60 shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-slate-800 font-semibold mb-2">
                  ユーザーネーム
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <IoPerson className="text-xl" />
                  </div>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-amber-100 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all duration-200 shadow-sm"
                    placeholder="ユーザーネームを入力"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-slate-800 font-semibold mb-2">
                  パスワード
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <IoLockClosed className="text-xl" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-amber-100 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all duration-200 shadow-sm"
                    placeholder="パスワードを入力"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-100 border border-red-200 rounded-lg text-red-700 text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-amber-400 via-pink-500 to-sky-500 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'ログイン中...' : 'ログイン'}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="mt-6 mb-6 flex items-center">
              <div className="flex-1 border-t border-amber-100"></div>
              <span className="px-4 text-slate-500 text-sm">または</span>
              <div className="flex-1 border-t border-amber-100"></div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-slate-600 mb-3">
                アカウントをお持ちでない方
              </p>
              <Link href="/signup">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-white border border-amber-100 text-slate-900 rounded-lg font-semibold hover:shadow-md transition-all duration-300"
                >
                  新規登録
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Back to Home Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-6"
          >
            <Link href="/" className="text-slate-600 hover:text-slate-900 transition-colors duration-200">
              ← ホームに戻る
            </Link>
          </motion.div>
        </motion.div>
      </main>
      <AppFooter />
    </>
  )
}
