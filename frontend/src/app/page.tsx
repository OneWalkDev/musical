'use client'

import { motion } from 'motion/react'
import { AppHeader } from '@/components/layout/AppHeader'
import { IoMusicalNotes, IoSparkles } from 'react-icons/io5'
import { FaGuitar, FaDrum } from 'react-icons/fa'
import { GiGrandPiano } from 'react-icons/gi'
import Link from 'next/link'
import { apiRequest } from '@/utils/api'
import { useEffect, useState } from 'react'

interface Stats {
  today_exchange: {
    title: string
    artist: string
    genre: string
  } | null
  popular_track: {
    title: string
    artist: string
    genre: string
  } | null
  active_users: number
}

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiRequest('/api/stats/')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('統計情報の取得に失敗しました:', error)
      }
    }

    fetchStats()
    // 30秒ごとに更新
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100
      }
    }
  }

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100
      }
    }
  }

  return (
    <>
      <AppHeader />
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#fff1d7] via-[#ffe7f7] to-[#dff6ff] text-slate-900">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -left-10 -top-14 w-72 h-72 bg-gradient-to-br from-amber-200/70 to-pink-200/60 rounded-full blur-3xl will-change-transform" />
          <div className="absolute right-0 top-16 w-80 h-80 bg-gradient-to-br from-cyan-200/60 via-sky-200/50 to-emerald-200/50 rounded-full blur-3xl will-change-transform" />
          <div className="absolute left-1/3 -bottom-20 w-96 h-96 bg-gradient-to-br from-emerald-100/70 via-white to-amber-200/60 rounded-full blur-3xl will-change-transform" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(249,115,22,0.14),transparent_38%),radial-gradient(circle_at_78%_10%,rgba(14,165,233,0.14),transparent_36%),radial-gradient(circle_at_50%_70%,rgba(16,185,129,0.12),transparent_42%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.5)_1px,transparent_1px)] bg-[size:22px_22px]" />
          <div className="absolute left-1/2 top-[-120px] h-72 w-72 -translate-x-1/2 rounded-full bg-gradient-to-br from-pink-200 via-white to-cyan-200 opacity-60 blur-2xl animate-[spin_14s_linear_infinite] will-change-transform" />
          <div className="absolute left-8 bottom-16 h-20 w-20 rounded-full border border-amber-100/80 animate-[pulse_5s_ease_infinite]" />
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 sm:pt-20 pb-14 sm:pb-22 md:pb-24 px-4">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
            <div className="space-y-6 sm:space-y-7 lg:space-y-8">

              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.7 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.04] tracking-tight"
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-pink-500 to-sky-500">自分にあう</span>
                <br />
                新しい音楽を発見しよう
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="text-lg sm:text-xl text-slate-700 leading-relaxed max-w-2xl"
              >
                1日1曲だけ投稿すると、同じジャンルのランダムで1曲が返ってくる交換所。
                好きなジャンルをセットして投げるだけ。最高のアーティスト達と出会えます。
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4"
              >
                <Link href="/music" className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.03, boxShadow: '0 14px 36px rgba(234,88,12,0.2)' }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full px-7 sm:px-9 py-3.5 sm:py-4 bg-gradient-to-r from-amber-400 via-pink-500 to-sky-500 text-white rounded-full font-semibold text-base sm:text-lg shadow-lg transition-all duration-300 hover:shadow-xl"
                    aria-label="音楽交換を今すぐ始める"
                  >
                    今すぐ始める
                  </motion.button>
                </Link>
                <Link href="/signup" className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full px-7 sm:px-9 py-3.5 sm:py-4 bg-white/80 text-slate-900 rounded-full font-semibold text-base sm:text-lg border border-amber-100 shadow-md hover:shadow-lg transition-all duration-300 hover:bg-white"
                    aria-label="新しいアカウントを作成"
                  >
                    アカウントを作成
                  </motion.button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.6 }}
                className="flex flex-col sm:flex-row items-center gap-4 bg-white/80 border border-amber-100 shadow-sm rounded-2xl p-4 backdrop-blur"
                role="status"
                aria-live="polite"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 via-pink-400 to-sky-400 flex items-center justify-center text-white text-xl shadow-inner" aria-hidden="true">
                    <IoMusicalNotes />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-amber-600 font-semibold">now swapping</p>
                    <p className="text-base font-semibold text-slate-900">
                      {stats?.popular_track ?
                        `${stats.popular_track.title} · ${stats.popular_track.genre}` :
                        'Sunrise Chill · City Pop'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm font-semibold text-amber-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                  {stats?.active_users || 0}人交換完了！
                </div>
              </motion.div>

            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.7 }}
              className="relative"
              aria-label="音楽交換のデモカード"
            >
              <div className="absolute -inset-6 bg-gradient-to-br from-pink-200/60 via-white to-sky-200/60 blur-3xl will-change-transform" aria-hidden="true" />
              <div className="absolute -left-10 top-4 h-16 w-16 rounded-full bg-gradient-to-br from-amber-400/30 to-pink-300/30 blur-xl animate-[spin_10s_linear_infinite] will-change-transform" aria-hidden="true" />
              <div className="relative rounded-[30px] border border-white/60 bg-white/80 backdrop-blur-xl shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.24),transparent_38%),radial-gradient(circle_at_80%_0,rgba(255,255,255,0.15),transparent_35%)]" aria-hidden="true" />
                <div className="relative p-6 border-b border-white/60 flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">today&apos;s mix</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">
                      {stats?.today_exchange?.title || 'Neon Lagoon'}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {stats?.today_exchange ?
                        `${stats.today_exchange.artist} · ${stats.today_exchange.genre}` :
                        'City Pop · 夜景に合う'
                      }
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-pink-100 text-amber-700 text-xs font-semibold shadow-sm">
                    交換済
                  </span>
                </div>

                <div className="relative p-6 space-y-6">
                  <div className="relative mx-auto aspect-square max-w-[360px] flex items-center justify-center">
                    <div className="absolute inset-6 rounded-full bg-gradient-to-br from-amber-200 via-pink-200 to-sky-200 blur-2xl opacity-70 animate-[spin_20s_linear_infinite] will-change-transform" aria-hidden="true" />
                    <div className="relative h-full w-full max-h-[320px] max-w-[320px] rounded-[32px] bg-white/70 border border-white/60 shadow-inner flex items-center justify-center">
                      <div className="relative h-48 w-48 sm:h-56 sm:w-56 rounded-full bg-gradient-to-r from-amber-400 via-pink-500 to-sky-500 shadow-xl flex items-center justify-center animate-[spin_12s_linear_infinite] will-change-transform">
                        <div className="h-14 w-14 rounded-full bg-white text-amber-500 flex items-center justify-center text-2xl font-bold shadow-md" aria-hidden="true">
                          <IoMusicalNotes />
                        </div>
                      </div>
                      <div className="absolute -right-4 top-1/3 rounded-2xl bg-white/80 border border-amber-100 px-4 py-3 shadow-lg">
                        <p className="text-xs uppercase tracking-[0.22em] text-amber-600 font-semibold">ジャンル</p>
                        <p className="text-sm font-semibold text-slate-900">{stats?.today_exchange ? `${stats.today_exchange.genre}` : "Chill"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute -left-10 -top-10 text-amber-200/70 text-6xl animate-float" aria-hidden="true">
                <FaGuitar />
              </div>
              <div className="pointer-events-none absolute -right-6 top-6 text-pink-200/70 text-5xl animate-float" aria-hidden="true">
                <GiGrandPiano />
              </div>
              <div className="pointer-events-none absolute right-10 -bottom-10 text-cyan-200/70 text-6xl animate-float" aria-hidden="true">
                <FaDrum />
              </div>
            </motion.div>
          </div>
        </section>

        {/* How it works Section */}
        <section className="relative py-12 sm:py-16 md:py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-3 max-w-3xl mx-auto"
            >
              <p className="text-sm font-semibold text-pink-600 tracking-[0.2em]">HOW TO PLAY</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900">
                3ステップで新たな出会いを
              </h2>
              <p className="text-base sm:text-lg text-slate-700">
                難しいことは抜き。いつもの再生リストから1曲選ぶだけで、知らない誰かの日常に飛んでいく。
              </p>
            </motion.div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 mt-10 sm:mt-12"
              >
              {[
                { step: '1', title: '登録してログイン', desc: '必要なのはニックネームとパスワードだけ。すぐに始められる' },
                { step: '2', title: 'ジャンル・気分をセット', desc: '好きなジャンルやシーンで「今日の1曲」を決める。' },
                { step: '3', title: '今日の1曲を投稿', desc: 'YouTubeのリンクを貼るだけ。1日1曲。' },
                { step: '4', title: '同ジャンルの1曲が届く', desc: '誰かから曲が返ってくる。新たな出会いを見つけよう。' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className={`relative overflow-hidden rounded-3xl bg-white/85 border border-white/60 shadow-xl p-6 sm:p-7 group ${['-rotate-2','rotate-2','-rotate-1','rotate-1'][index]} hover:rotate-0 hover:shadow-2xl transition-all duration-300`}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.22),transparent_36%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
                  <div className="relative flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-pink-500 to-sky-500 text-white font-bold text-xl sm:text-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform" aria-label={`ステップ${item.step}`}>
                      {item.step}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg sm:text-xl font-semibold text-slate-900">{item.title}</h3>
                      <p className="text-slate-700 text-sm sm:text-base leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-12 sm:py-16 md:py-20 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto"
          >
            <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-amber-400 via-pink-500 to-sky-500 text-white p-8 sm:p-10 md:p-12 shadow-2xl rotate-1 hover:rotate-0 hover:shadow-3xl transition-all duration-300">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.25),transparent_35%),radial-gradient(circle_at_80%_0,rgba(255,255,255,0.16),transparent_32%)]" aria-hidden="true" />
              <div className="absolute -left-6 -top-6 h-20 w-20 rounded-full border-2 border-white/40" aria-hidden="true" />
              <div className="absolute right-4 top-4 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold tracking-[0.2em] shadow-sm" aria-hidden="true">PLAY</div>
              <div className="relative flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
                <div className="flex-1 space-y-4 text-center lg:text-left">
                  <p className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-[0.28em] text-white/80">
                    <IoSparkles />
                    LET&apos;S SWAP
                  </p>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight drop-shadow-sm">
                    1日1曲交換で、自分にぴったりの音楽へ
                  </h2>
                  <p className="text-base sm:text-lg text-white/90 max-w-2xl leading-relaxed">
                    スマホひとつで、新しいアーティストに出会える。同じジャンルで交換するから好みに寄り添った曲と出会える。
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto lg:flex-col">
                  <Link href="/signup" className="w-full sm:w-auto">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full px-7 sm:px-9 py-3.5 bg-white text-pink-600 rounded-full font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-shadow"
                      aria-label="無料でアカウントを作成"
                    >
                      無料で始める
                    </motion.button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
    </>
  )
}
