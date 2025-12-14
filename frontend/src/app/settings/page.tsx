'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { AppHeader } from '@/components/layout/AppHeader'
import { IoMusicalNotes, IoSettingsSharp } from 'react-icons/io5'
import { FaHistory, FaHeart } from 'react-icons/fa'
import { AppFooter } from '@/components/layout/AppFooter'

export default function SettingsPage() {
  const cards = [
    {
      title: '受け取るジャンル',
      desc: '届く曲のジャンルを選び直す',
      href: '/receive/preferences',
      icon: <FaHeart />,
      color: 'from-amber-400 via-pink-500 to-sky-500'
    },
    {
      title: '受信履歴',
      desc: 'これまで届いた曲を確認',
      href: '/receive/history',
      icon: <FaHistory />,
      color: 'from-sky-500 via-cyan-500 to-emerald-500'
    },
  ]

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
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/80 border border-amber-100 text-amber-700 shadow-sm">
              <IoMusicalNotes className="text-lg" />
              設定
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-4">
              あなたに届く音をカスタマイズ
            </h1>
            <p className="text-slate-600 mt-2">
              受信ジャンルの変更や履歴の確認はこちらから
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {cards.map((card, idx) => (
              <motion.div
                key={card.href}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="relative overflow-hidden rounded-3xl bg-white/85 backdrop-blur-xl border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-20`} />
                <div className="relative p-6 flex flex-col h-full gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${card.color} text-white flex items-center justify-center text-xl shadow-md`}>
                      {card.icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">{card.title}</h2>
                      <p className="text-sm text-slate-600">{card.desc}</p>
                    </div>
                  </div>
                  <div className="flex-1" />
                  <Link
                    href={card.href}
                    className="inline-flex items-center justify-center px-4 py-3 rounded-xl bg-white text-slate-900 font-semibold border border-amber-100 shadow-sm hover:shadow-md transition-all"
                  >
                    開く
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <AppFooter />
    </>
  )
}
