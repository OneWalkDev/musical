'use client'

import { AppHeader } from '@/components/layout/AppHeader'
import { AppFooter } from '@/components/layout/AppFooter'
import { motion } from 'motion/react'

export default function PrivacyPolicy() {
  return (
    <>
      <AppHeader />
      <main className="relative min-h-screen bg-gradient-to-br from-[#fff1d7] via-[#ffe7f7] to-[#dff6ff] text-slate-900 py-12 px-4">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -left-16 -top-10 w-64 h-64 bg-gradient-to-br from-amber-200/70 to-pink-200/60 rounded-full blur-3xl" />
          <div className="absolute right-0 top-16 w-72 h-72 bg-gradient-to-br from-cyan-200/60 via-sky-200/50 to-emerald-200/50 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto relative z-10"
        >
          <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/60 shadow-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8">プライバシーポリシー</h1>

            <div className="space-y-8 text-slate-700">
              <section>
                <p className="text-sm text-slate-500 mb-6">最終更新日：2025年12月17日</p>
                <p className="leading-relaxed">
                  Musical（以下「当サービス」）は、ユーザーの皆様の個人情報保護を重要視しています。
                  本プライバシーポリシーでは、当サービスがどのような情報を収集し、どのように使用・保護するかについて説明します。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">1. 収集する情報</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">1.1 登録情報</h3>
                    <p className="leading-relaxed">
                      当サービスを利用する際、以下の情報を収集します：
                    </p>
                    <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                      <li>ユーザー名（ニックネーム）</li>
                      <li>パスワード（暗号化して保存）</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">1.2 投稿情報</h3>
                    <p className="leading-relaxed">
                      ユーザーが投稿する以下の情報を収集します：
                    </p>
                    <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                      <li>楽曲情報（曲名、アーティスト名、YouTube URL）</li>
                      <li>ジャンル情報</li>
                      <li>コメント・感想</li>
                      <li>投稿日時</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">1.3 自動的に収集される情報</h3>
                    <p className="leading-relaxed">
                      当サービスの利用に際して、以下の情報が自動的に収集される場合があります：
                    </p>
                    <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                      <li>IPアドレス</li>
                      <li>ブラウザの種類</li>
                      <li>アクセス日時</li>
                      <li>利用状況</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">2. 情報の利用目的</h2>
                <p className="leading-relaxed mb-2">
                  収集した情報は、以下の目的で利用します：
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>当サービスの提供・運営</li>
                  <li>ユーザー認証とアカウント管理</li>
                  <li>楽曲の交換・マッチング機能の提供</li>
                  <li>ユーザーサポートの提供</li>
                  <li>サービスの改善・新機能の開発</li>
                  <li>利用規約違反への対応</li>
                  <li>統計データの作成（個人を特定できない形式）</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">3. 情報の共有</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">3.1 他のユーザーとの共有</h3>
                    <p className="leading-relaxed">
                      楽曲交換機能により、以下の情報が他のユーザーに表示されます：
                    </p>
                    <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                      <li>ユーザー名</li>
                      <li>投稿した楽曲情報</li>
                      <li>コメント・感想</li>
                    </ul>
                    <p className="mt-2 text-sm text-slate-600">
                      ※メールアドレスやパスワードなどの個人情報は他のユーザーに表示されません。
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">3.2 第三者への提供</h3>
                    <p className="leading-relaxed">
                      以下の場合を除き、ユーザーの同意なく第三者に個人情報を提供することはありません：
                    </p>
                    <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                      <li>法令に基づく場合</li>
                      <li>人の生命、身体または財産の保護のために必要がある場合</li>
                      <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合</li>
                      <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">4. 情報の保護</h2>
                <p className="leading-relaxed">
                  当サービスは、ユーザーの個人情報を適切に管理し、以下の対策を講じています：
                </p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                  <li>パスワードの暗号化保存</li>
                  <li>不正アクセス防止のためのセキュリティ対策</li>
                  <li>データベースへのアクセス制限</li>
                  <li>定期的なセキュリティ監査</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Cookie（クッキー）について</h2>
                <p className="leading-relaxed">
                  当サービスでは、ユーザー認証とサービスの機能向上のためにCookieを使用しています。
                  Cookieを無効にすることもできますが、その場合、当サービスの一部機能が利用できなくなる可能性があります。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">6. ユーザーの権利</h2>
                <p className="leading-relaxed mb-2">
                  ユーザーは、自身の個人情報について以下の権利を有します：
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>個人情報の開示請求</li>
                  <li>個人情報の訂正・追加・削除の請求</li>
                  <li>個人情報の利用停止・消去の請求</li>
                  <li>アカウントの削除</li>
                </ul>
                <p className="mt-4 leading-relaxed">
                  これらの請求については、お問い合わせ窓口までご連絡ください。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">7. 外部サービスの利用</h2>
                <p className="leading-relaxed">
                  当サービスは、楽曲の共有にYouTubeを利用しています。YouTubeの利用については、
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700 underline">
                    Googleのプライバシーポリシー
                  </a>
                  が適用されます。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">8. プライバシーポリシーの変更</h2>
                <p className="leading-relaxed">
                  当サービスは、必要に応じて本プライバシーポリシーを変更することがあります。
                  変更後のプライバシーポリシーは、当サービス上に掲載した時点で効力を生じるものとします。
                  重要な変更がある場合は、サービス内で通知いたします。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">9. お問い合わせ</h2>
                <p className="leading-relaxed">
                  本プライバシーポリシーに関するお問い合わせは、以下までご連絡ください：
                </p>
                <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="font-semibold">Musical 運営チーム</p>
                  <p className="text-sm mt-2">
                    メール：
                    <a href="mailto:musical-contact@onewalk.dev" className="text-pink-600 hover:text-pink-700 underline ml-1">
                      musical-contact@onewalk.dev
                    </a>
                  </p>
                  <p className="text-sm mt-2">
                    GitHub：
                    <a href="https://github.com/yurisi0212/musical/issues" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700 underline ml-1">
                      Issues
                    </a>
                  </p>
                </div>
              </section>
            </div>
          </div>
        </motion.div>
      </main>
      <AppFooter />
    </>
  )
}
