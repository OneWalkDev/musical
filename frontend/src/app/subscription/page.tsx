'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'motion/react'
import { AppHeader } from '@/components/layout/AppHeader'
import { IoCheckmarkCircle, IoMusicalNotes, IoRocketSharp, IoTrophy } from 'react-icons/io5'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { FaCoffee, FaCookie, FaCrown, FaFireAlt, FaPlus, FaTrophy } from 'react-icons/fa'

interface SubscriptionType {
  id: number
  title: string
  price: number
  description: string
  post_limit: number
}

// Payjp型定義
declare global {
  interface Window {
    Payjp?: any
  }
}

export default function SubscriptionPage() {
  const [subscriptionTypes, setSubscriptionTypes] = useState<SubscriptionType[]>([])
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const cardElementRef = useRef<any>(null)
  const payjpInstanceRef = useRef<any>(null)

  useEffect(() => {
    // 認証チェック中は何もしない
    if (authLoading) {
      return
    }

    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    checkExistingSubscription()
  }, [isAuthenticated, authLoading, router])

  // payjp.jsスクリプトを動的に読み込み
  useEffect(() => {
    // スクリプトが既に存在する場合はスキップ
    if (document.getElementById('payjp-script')) {
      return
    }

    const script = document.createElement('script')
    script.src = 'https://js.pay.jp/v2/pay.js'
    script.type = 'text/javascript'
    script.id = 'payjp-script'

    script.onload = () => {
      console.log('payjp.js loaded successfully')
    }

    script.onerror = (e) => {
      console.error('Failed to load payjp.js:', e)
      setError('決済システムの読み込みに失敗しました')
    }

    document.head.appendChild(script)

    return () => {
      // クリーンアップ時にスクリプトを削除
      const existingScript = document.getElementById('payjp-script')
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript)
      }
    }
  }, [])

  // カードエレメントをマウント
  useEffect(() => {
    if (!showPaymentModal || !window.Payjp || cardElementRef.current) return

    const publicKey = process.env.NEXT_PUBLIC_PAYJP_PUBLIC_KEY
    if (!publicKey) return

    // Payjpインスタンスを一度だけ作成
    if (!payjpInstanceRef.current) {
      payjpInstanceRef.current = (window as any).Payjp(publicKey)
    }

    const elements = payjpInstanceRef.current.elements()
    const cardElement = elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#1e293b',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          '::placeholder': {
            color: '#94a3b8',
          },
        },
      },
    })

    cardElement.mount('#card-element')
    cardElementRef.current = cardElement

    return () => {
      if (cardElementRef.current) {
        cardElementRef.current.unmount()
        cardElementRef.current = null
      }
    }
  }, [showPaymentModal])

  const fetchSubscriptionTypes = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subscription-types/`)
      if (!response.ok) throw new Error('Failed to fetch subscription types')
      const data = await response.json()
      setSubscriptionTypes(data)
    } catch (err) {
      setError('サブスクリプションプランの取得に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const checkExistingSubscription = async () => {
    try {
      const authToken = localStorage.getItem('auth_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-subscription/`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.has_subscription) {
          router.replace('/subscription/manage')
          return
        }
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error)
    }

    fetchSubscriptionTypes()
  }

  const handleSelectPlan = () => {
    if (!selectedPlan) {
      setError('プランを選択してください')
      return
    }

    if (!(window as any).Payjp) {
      setError('決済システムが読み込まれていません')
      return
    }

    setShowPaymentModal(true)
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!cardElementRef.current || !selectedPlan || !payjpInstanceRef.current) return

    setIsProcessing(true)
    setError('')

    try {
      // カードエレメントからトークンを作成
      const result = await payjpInstanceRef.current.createToken(cardElementRef.current)

      if (result.error) {
        setError(result.error.message || 'カード情報の検証に失敗しました')
        setIsProcessing(false)
        return
      }

      // バックエンドに決済リクエストを送信
      const authToken = localStorage.getItem('auth_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subscriptions/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          subscription_type_id: selectedPlan,
          payjp_token: result.id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || '決済に失敗しました')
      }

      await response.json()
      setShowPaymentModal(false)
      setShowSuccessModal(true)
    } catch (err) {
      console.error('Payment error:', err)
      setError(err instanceof Error ? err.message : 'サブスクリプションの作成に失敗しました')
    } finally {
      setIsProcessing(false)
    }
  }


  const getPlanIcon = (index: number) => {
    const icons = [FaPlus, FaTrophy, FaCrown]
    return icons[index % icons.length]
  }

  const getPlanColor = (index: number) => {
    const colors = [
      'from-amber-400 to-orange-500',
      'from-pink-400 to-rose-500',
      'from-sky-400 to-cyan-500',
    ]
    return colors[index % colors.length]
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
        {/* Background decorations */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -left-16 -top-10 w-64 h-64 bg-gradient-to-br from-amber-200/70 to-pink-200/60 rounded-full blur-3xl" />
          <div className="absolute right-0 top-16 w-72 h-72 bg-gradient-to-br from-cyan-200/60 via-sky-200/50 to-emerald-200/50 rounded-full blur-3xl" />
          <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-gradient-to-br from-emerald-100/70 via-white to-amber-200/60 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              サブスクリプションプラン
            </h1>
            <p className="text-lg text-slate-600">
              あなたに合ったプランを選んで、もっと音楽を楽しもう
            </p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto mb-6 p-4 bg-red-100 border border-red-200 rounded-lg text-red-700"
            >
              {error}
            </motion.div>
          )}

          {/* Subscription Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {subscriptionTypes.map((plan, index) => {
              const Icon = getPlanIcon(index)
              const colorClass = getPlanColor(index)
              const isSelected = selectedPlan === plan.id

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`relative bg-white/90 backdrop-blur-xl rounded-2xl p-6 border-2 transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'border-amber-400 shadow-2xl'
                      : 'border-white/60 shadow-lg hover:shadow-xl'
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {/* Selection indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-3 -right-3"
                    >
                      <IoCheckmarkCircle className="text-4xl text-amber-500" />
                    </motion.div>
                  )}

                  {/* Plan Icon */}
                  <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${colorClass} mb-4`}>
                    <Icon className="text-3xl text-white" />
                  </div>

                  {/* Plan Title */}
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.title}</h3>

                  {/* Plan Price */}
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-slate-900">¥{plan.price.toLocaleString()}</span>
                    <span className="text-slate-600 ml-2">/月</span>
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    <div className="flex items-start text-slate-700">
                      <IoCheckmarkCircle className="text-green-500 mr-2 flex-shrink-0 mt-1" />
                      <span dangerouslySetInnerHTML={{ __html: plan.description.replace(/\n/g, '<br>') }} />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-md mx-auto space-y-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSelectPlan}
              disabled={!selectedPlan}
              className="w-full py-4 bg-gradient-to-r from-amber-400 via-pink-500 to-sky-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {selectedPlan ? 'このプランを選択' : 'プランを選択してください'}
            </motion.button>

            <button
              onClick={() => router.back()}
              className="w-full py-4 bg-white/80 border border-amber-100 text-slate-900 rounded-xl font-semibold hover:shadow-md transition-all duration-300"
            >
              戻る
            </button>
          </motion.div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => !isProcessing && setShowPaymentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6">カード情報入力</h2>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handlePaymentSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    カード情報
                  </label>
                  <div
                    id="card-element"
                    className="p-4 border border-slate-300 rounded-lg bg-white"
                  ></div>
                  <p className="mt-2 text-xs text-slate-500">
                    テストカード: 4242 4242 4242 4242 / 有効期限: 12/25 / CVC: 123
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    disabled={isProcessing}
                    className="flex-1 py-3 bg-slate-200 text-slate-900 rounded-lg font-semibold hover:bg-slate-300 transition-colors disabled:opacity-50"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 py-3 bg-gradient-to-r from-amber-400 via-pink-500 to-sky-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {isProcessing ? '処理中...' : '決済する'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center"
              >
                <IoCheckmarkCircle className="text-5xl text-white" />
              </motion.div>

              <h2 className="text-3xl font-bold text-slate-900 mb-3">
                サブスクリプション完了！
              </h2>
              <p className="text-slate-600 mb-8">
                サブスクリプションが正常に作成されました。<br />
                ありがとうございます！
              </p>

              <button
                onClick={() => {
                  setShowSuccessModal(false)
                  router.push('/')
                }}
                className="w-full py-4 bg-gradient-to-r from-amber-400 via-pink-500 to-sky-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                トップページへ
              </button>
            </motion.div>
          </motion.div>
        )}

      </main>
    </>
  )
}
