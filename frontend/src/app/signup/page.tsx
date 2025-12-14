'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { AppHeader } from '@/components/layout/AppHeader'
import { IoMusicalNotes, IoLockClosed, IoPerson } from 'react-icons/io5'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { AppFooter } from '@/components/layout/AppFooter'

export default function SignupPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const { signup, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/music")
    }
  });

  // ユーザーネームのバリデーション
  const validateUsername = (value: string): string => {
    if (value.length < 3) {
      return 'ユーザーネームは3文字以上で入力してください'
    }
    // 日本語、英語、数字のみを許可（ひらがな、カタカナ、漢字、英字、数字）
    const validPattern = /^[a-zA-Z0-9ぁ-んァ-ヶー一-龯々]+$/
    if (!validPattern.test(value)) {
      return 'ユーザーネームは日本語、英語、数字のみ使用できます'
    }
    return ''
  }

  const handleUsernameChange = (value: string) => {
    setUsername(value)
    if (value.length > 0) {
      const error = validateUsername(value)
      setUsernameError(error)
    } else {
      setUsernameError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // ユーザーネームのバリデーション
    const usernameValidationError = validateUsername(username)
    if (usernameValidationError) {
      setError(usernameValidationError)
      return
    }

    // パスワード確認
    if (password !== confirmPassword) {
      setError('パスワードが一致しません')
      return
    }

    setIsLoading(true)
    try {
      await signup(username, password)
      router.push('/profile-setup')
    } catch (err) {
      setError(err instanceof Error ? err.message : '登録に失敗しました')
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
            <p className="text-slate-600">アカウントを作成して始めよう</p>
          </motion.div>

          {/* Signup Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/85 backdrop-blur-xl rounded-3xl p-8 border border-white/60 shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
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
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all duration-200 shadow-sm ${usernameError ? 'border-red-300' : 'border-amber-100'
                      }`}
                    placeholder="ユーザーネームを入力"
                    required
                    minLength={3}
                  />
                </div>
                {usernameError && (
                  <p className="mt-1 text-xs text-red-600">
                    {usernameError}
                  </p>
                )}
                {!usernameError && username.length > 0 && (
                  <p className="mt-1 text-xs text-slate-500">
                    日本語、英語、数字のみ使用できます（3文字以上）
                  </p>
                )}
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
                    minLength={8}
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  8文字以上で入力してください
                </p>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-slate-800 font-semibold mb-2">
                  パスワード（確認）
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <IoLockClosed className="text-xl" />
                  </div>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-amber-100 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all duration-200 shadow-sm"
                    placeholder="もう一度パスワードを入力"
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
                {isLoading ? '登録中...' : '新規登録'}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="mt-6 mb-6 flex items-center">
              <div className="flex-1 border-t border-amber-100"></div>
              <span className="px-4 text-slate-500 text-sm">または</span>
              <div className="flex-1 border-t border-amber-100"></div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-slate-600 mb-3">
                すでにアカウントをお持ちの方
              </p>
              <Link href="/login">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-white border border-amber-100 text-slate-900 rounded-lg font-semibold hover:shadow-md transition-all duration-300"
                >
                  ログイン
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
