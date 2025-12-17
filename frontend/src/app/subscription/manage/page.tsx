'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { AppHeader } from '@/components/layout/AppHeader'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { IoCheckmarkCircle, IoMusicalNotes, IoWarning } from 'react-icons/io5'
import { FaCrown, FaRegCalendarAlt, FaTag } from 'react-icons/fa'

interface Subscription {
  id: number
  payment_method_id: string
  payment_is_finished: boolean
  created_at: string
  canceled_at: string | null
  subscription_type: {
    id: number
    title: string
    price: number
    description: string
    post_limit: number
  }
}

const formatDate = (value: string | null) => {
  if (!value) return '---'
  return new Date(value).toLocaleDateString('ja-JP')
}

const getActiveUntil = (value: string) => {
  const date = new Date(value)
  const activeUntil = new Date(date)
  activeUntil.setMonth(activeUntil.getMonth() + 1)
  return activeUntil
}

export default function SubscriptionManagePage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [isCanceling, setIsCanceling] = useState(false)
  const [cancelSuccess, setCancelSuccess] = useState(false)
  const activeUntil = subscription ? getActiveUntil(subscription.created_at) : null
  const isCanceled = Boolean(subscription?.canceled_at)

  useEffect(() => {
    if (authLoading) return

    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    fetchSubscription()
  }, [authLoading, isAuthenticated, router])

  const fetchSubscription = async () => {
    try {
      const authToken = localStorage.getItem('auth_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-subscription/`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch subscription')
      }

      const data = await response.json()
      if (data.has_subscription) {
        setSubscription(data.subscription)
      } else {
        setSubscription(null)
      }
    } catch (err) {
      setError('サブスクリプション情報の取得に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!subscription) return

    setIsCanceling(true)
    setError('')

    try {
      const authToken = localStorage.getItem('auth_token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/subscriptions/${subscription.id}/cancel/`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || '解約に失敗しました')
      }

      const data = await response.json()
      setCancelSuccess(true)
      setSubscription(data.subscription)
      setShowCancelModal(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : '解約に失敗しました')
    } finally {
      setIsCanceling(false)
    }
  }

  if (authLoading || isLoading) {
    return (
      <>
        <AppHeader />
        <main className="relative min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[#fff1d7] via-[#ffe7f7] to-[#dff6ff]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
            <p className="mt-4 text-slate-600">読み込み中...</p>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <AppHeader />
      <main className="relative min-h-screen px-4 py-12 overflow-hidden bg-gradient-to-br from-[#fff1d7] via-[#ffe7f7] to-[#dff6ff] text-slate-900">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -left-16 -top-12 w-72 h-72 bg-gradient-to-br from-amber-200/70 to-pink-200/60 rounded-full blur-3xl" />
          <div className="absolute right-0 top-16 w-80 h-80 bg-gradient-to-br from-cyan-200/60 via-sky-200/50 to-emerald-200/50 rounded-full blur-3xl" />
          <div className="absolute left-1/3 -bottom-24 w-80 h-80 bg-gradient-to-br from-emerald-100/70 via-white to-amber-200/60 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/80 border border-amber-100 text-amber-700 shadow-sm">
              <IoMusicalNotes className="text-lg" />
              サブスクリプション管理
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-4">
              プランの詳細と解約
            </h1>
            <p className="text-slate-600 mt-2">
              現在のプラン内容と解約手続きを確認できます
            </p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto mb-6 p-4 bg-red-100 border border-red-200 rounded-lg text-red-700"
            >
              {error}
            </motion.div>
          )}

          {cancelSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto mb-6 p-4 bg-emerald-100 border border-emerald-200 rounded-lg text-emerald-700"
            >
              解約を受け付けました。有効期限まで引き続き利用できます。
            </motion.div>
          )}

          {!subscription ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/60 text-center"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 via-pink-500 to-sky-500 flex items-center justify-center text-white text-2xl shadow-lg">
                <FaCrown />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mt-4">サブスクリプション未登録</h2>
              <p className="text-slate-600 mt-2">
                まずはプランを選んでサブスクリプションを開始しましょう。
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/subscription"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-pink-500 to-sky-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  プランを確認する
                </Link>
                <Link
                  href="/settings"
                  className="px-6 py-3 rounded-xl bg-white/80 border border-amber-100 text-slate-900 font-semibold hover:shadow-md transition-all"
                >
                  設定に戻る
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/60"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-400 via-pink-500 to-sky-500 text-white flex items-center justify-center text-xl shadow-md">
                      <FaCrown />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-semibold">現在のプラン</p>
                      <h2 className="text-2xl font-bold text-slate-900">{subscription.subscription_type.title}</h2>
                    </div>
                  </div>
                  <div className="mt-6">
                    <p className="text-4xl font-bold text-slate-900">
                      ¥{subscription.subscription_type.price.toLocaleString()}
                      <span className="text-base text-slate-600 ml-2">/月</span>
                    </p>
                  </div>
                  <div className="mt-4 text-slate-700">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: subscription.subscription_type.description.replace(/\n/g, '<br>'),
                      }}
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/60"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-emerald-500 text-white flex items-center justify-center text-xl shadow-md">
                      <IoCheckmarkCircle />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-semibold">登録情報</p>
                      <h2 className="text-2xl font-bold text-slate-900">ご利用状況</h2>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-3 text-slate-700">
                      <FaRegCalendarAlt className="text-amber-500" />
                      <span>開始日</span>
                      <span className="ml-auto font-semibold">{formatDate(subscription.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-700">
                      <FaTag className="text-emerald-500" />
                      <span>状態</span>
                      <span className={`ml-auto font-semibold ${isCanceled ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {isCanceled ? '解約済み' : '有効'}
                      </span>
                    </div>
                    {isCanceled && activeUntil && (
                      <div className="flex items-center gap-3 text-slate-700">
                        <FaRegCalendarAlt className="text-rose-500" />
                        <span>有効期限</span>
                        <span className="ml-auto font-semibold">{activeUntil.toLocaleDateString('ja-JP')}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/60"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-rose-400 via-orange-400 to-amber-400 text-white flex items-center justify-center text-xl shadow-md">
                    <IoWarning />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-semibold">解約手続き</p>
                    <h2 className="text-2xl font-bold text-slate-900">サブスクリプションを解約</h2>
                  </div>
                </div>
                <p className="text-slate-600 mt-4">
                  解約後は登録から1ヶ月の有効期限まで利用できます。再登録はいつでも可能です。
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  {isCanceled ? (
                    <div className="px-6 py-3 rounded-xl bg-amber-100 text-amber-700 font-semibold text-center">
                      解約受付済み
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowCancelModal(true)}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      解約する
                    </button>
                  )}
                  <Link
                    href="/settings"
                    className="px-6 py-3 rounded-xl bg-white/80 border border-amber-100 text-slate-900 font-semibold hover:shadow-md transition-all text-center"
                  >
                    設定に戻る
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </div>

        {showCancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => !isCanceling && setShowCancelModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-slate-900">解約してもよろしいですか？</h2>
              <p className="text-slate-600 mt-3">
                解約後も登録から1ヶ月の有効期限まで利用できます。
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  disabled={isCanceling}
                  className="flex-1 py-3 bg-slate-200 text-slate-900 rounded-lg font-semibold hover:bg-slate-300 transition-colors disabled:opacity-50"
                >
                  戻る
                </button>
                <button
                  type="button"
                  onClick={handleCancelSubscription}
                  disabled={isCanceling}
                  className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {isCanceling ? '処理中...' : '解約する'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>
    </>
  )
}
