'use client'

import { AppHeader } from '@/components/layout/AppHeader'
import { AppFooter } from '@/components/layout/AppFooter'
import { motion } from 'motion/react'

export default function TermsOfService() {
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
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8">利用規約</h1>

            <div className="space-y-8 text-slate-700">
              <section>
                <p className="text-sm text-slate-500 mb-6">最終更新日：2025年12月17日</p>
                <p className="leading-relaxed">
                  この利用規約（以下「本規約」）は、Musical（以下「当サービス」）の利用条件を定めるものです。
                  ユーザーの皆様には、本規約に同意いただいた上で、当サービスをご利用いただきます。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">第1条（適用）</h2>
                <ol className="list-decimal list-inside space-y-2">
                  <li className="leading-relaxed">
                    本規約は、ユーザーと当サービスとの間の当サービスの利用に関わる一切の関係に適用されるものとします。
                  </li>
                  <li className="leading-relaxed">
                    当サービスは本規約のほか、当サービスに関するルールを定めることがあります。
                    これらのルールは、本規約の一部を構成するものとします。
                  </li>
                  <li className="leading-relaxed">
                    本規約の内容と前項のルールとの内容が矛盾する場合は、前項のルールが優先されるものとします。
                  </li>
                </ol>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">第2条（利用登録）</h2>
                <ol className="list-decimal list-inside space-y-2">
                  <li className="leading-relaxed">
                    当サービスの利用を希望する者は、本規約に同意の上、当サービスの定める方法によって利用登録を申請し、
                    当サービスがこれを承認することによって、利用登録が完了するものとします。
                  </li>
                  <li className="leading-relaxed">
                    当サービスは、利用登録の申請者に以下の事由があると判断した場合、利用登録の申請を承認しないことがあります：
                  </li>
                </ol>
                <ul className="list-disc list-inside ml-8 mt-2 space-y-1">
                  <li>利用登録の申請に際して虚偽の事項を届け出た場合</li>
                  <li>本規約に違反したことがある者からの申請である場合</li>
                  <li>その他、当サービスが利用登録を適当でないと判断した場合</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">第3条（アカウント情報の管理）</h2>
                <ol className="list-decimal list-inside space-y-2">
                  <li className="leading-relaxed">
                    ユーザーは、自己の責任において、当サービスのアカウント情報を適切に管理するものとします。
                  </li>
                  <li className="leading-relaxed">
                    ユーザーは、いかなる場合にも、アカウント情報を第三者に譲渡または貸与し、
                    もしくは第三者と共用することはできません。
                  </li>
                  <li className="leading-relaxed">
                    アカウント情報が盗まれたり、第三者に使用されていることが判明した場合、
                    ユーザーは直ちに当サービスにその旨連絡するものとします。
                  </li>
                </ol>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">第4条（サービス内容）</h2>
                <ol className="list-decimal list-inside space-y-2">
                  <li className="leading-relaxed">
                    当サービスは、ユーザーが音楽を共有し、交換するためのプラットフォームを提供します。
                  </li>
                  <li className="leading-relaxed">
                    ユーザーは1日1曲のみ投稿することができ、同じジャンルの他のユーザーの投稿とマッチングされます。
                  </li>
                  <li className="leading-relaxed">
                    当サービスは、サービス内容を予告なく変更、追加、削除することがあります。
                  </li>
                </ol>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">第5条（禁止事項）</h2>
                <p className="leading-relaxed mb-2">
                  ユーザーは、当サービスの利用にあたり、以下の行為をしてはなりません：
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>法令または公序良俗に違反する行為</li>
                  <li>犯罪行為に関連する行為</li>
                  <li>当サービスの運営を妨害するおそれのある行為</li>
                  <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
                  <li>他のユーザーに成りすます行為</li>
                  <li>当サービスのネットワークまたはシステム等に過度な負荷をかける行為</li>
                  <li>不正アクセスをし、またはこれを試みる行為</li>
                  <li>他のユーザーのアカウントを利用する行為</li>
                  <li>当サービスに虚偽または誤解を招くような情報を投稿する行為</li>
                  <li>わいせつな表現、暴力的な表現、その他反社会的な内容を含む情報を投稿する行為</li>
                  <li>著作権、商標権その他の知的財産権を侵害する行為</li>
                  <li>他のユーザーまたは第三者の権利を侵害する行為</li>
                  <li>他のユーザーまたは第三者に不利益、損害、不快感を与える行為</li>
                  <li>宗教活動または宗教団体への勧誘行為</li>
                  <li>その他、当サービスが不適切と判断する行為</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">第6条（投稿コンテンツの取り扱い）</h2>
                <ol className="list-decimal list-inside space-y-2">
                  <li className="leading-relaxed">
                    ユーザーは、投稿する楽曲情報について、自らが投稿する権利を有していることを保証するものとします。
                  </li>
                  <li className="leading-relaxed">
                    ユーザーが投稿したコンテンツに関する著作権は、当該ユーザーまたは既存の権利者に留保されます。
                  </li>
                  <li className="leading-relaxed">
                    当サービスは、投稿されたコンテンツをサービスの提供、運営、改善、プロモーションのために利用することができるものとします。
                  </li>
                  <li className="leading-relaxed">
                    当サービスは、投稿されたコンテンツが本規約に違反していると判断した場合、
                    事前の通知なく当該コンテンツを削除することができます。
                  </li>
                </ol>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">第7条（著作権について）</h2>
                <ol className="list-decimal list-inside space-y-2">
                  <li className="leading-relaxed">
                    ユーザーは、投稿する楽曲情報がYouTube上で公開されているコンテンツへのリンクであることを理解し、
                    第三者の著作権を尊重するものとします。
                  </li>
                  <li className="leading-relaxed">
                    著作権侵害の疑いがある投稿を発見した場合は、当サービスまで速やかにご連絡ください。
                  </li>
                </ol>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">第8条（利用制限および登録抹消）</h2>
                <ol className="list-decimal list-inside space-y-2">
                  <li className="leading-relaxed">
                    当サービスは、ユーザーが以下のいずれかに該当する場合、
                    事前の通知なく、当該ユーザーに対して、当サービスの全部もしくは一部の利用を制限し、
                    またはユーザーとしての登録を抹消することができるものとします：
                  </li>
                </ol>
                <ul className="list-disc list-inside ml-8 mt-2 space-y-1">
                  <li>本規約のいずれかの条項に違反した場合</li>
                  <li>登録事項に虚偽の事実があることが判明した場合</li>
                  <li>料金等の支払債務の不履行があった場合</li>
                  <li>当サービスからの連絡に対し、一定期間返答がない場合</li>
                  <li>当サービスの利用が長期間にわたってない場合</li>
                  <li>その他、当サービスが当サービスの利用を適当でないと判断した場合</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">第9条（保証の否認および免責事項）</h2>
                <ol className="list-decimal list-inside space-y-2">
                  <li className="leading-relaxed">
                    当サービスは、当サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、
                    特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）が
                    ないことを明示的にも黙示的にも保証しておりません。
                  </li>
                  <li className="leading-relaxed">
                    当サービスは、当サービスに起因してユーザーに生じたあらゆる損害について一切の責任を負いません。
                  </li>
                  <li className="leading-relaxed">
                    当サービスは、他のユーザーまたは第三者によるサービスの利用に起因してユーザーに生じた損害について、
                    一切の責任を負いません。
                  </li>
                </ol>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">第10条（サービス内容の変更等）</h2>
                <p className="leading-relaxed">
                  当サービスは、ユーザーに通知することなく、当サービスの内容を変更し、
                  または当サービスの提供を中止することができるものとし、
                  これによってユーザーに生じた損害について一切の責任を負いません。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">第11条（利用規約の変更）</h2>
                <ol className="list-decimal list-inside space-y-2">
                  <li className="leading-relaxed">
                    当サービスは、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。
                  </li>
                  <li className="leading-relaxed">
                    変更後の本規約は、当サービス上に掲載された時点で効力を生じるものとします。
                  </li>
                  <li className="leading-relaxed">
                    本規約の変更後、当サービスの利用を開始した場合には、変更後の規約に同意したものとみなします。
                  </li>
                </ol>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">第12条（個人情報の取扱い）</h2>
                <p className="leading-relaxed">
                  当サービスは、当サービスの利用によって取得する個人情報については、
                  <a href="/privacy" className="text-pink-600 hover:text-pink-700 underline">プライバシーポリシー</a>
                  に従い適切に取り扱うものとします。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">第13条（通知または連絡）</h2>
                <p className="leading-relaxed">
                  ユーザーと当サービスとの間の通知または連絡は、当サービスの定める方法によって行うものとします。
                  当サービスは、ユーザーから届け出のあった連絡先が最新のものとみなして当該連絡先へ通知または連絡を行い、
                  これらは、発信時にユーザーへ到達したものとみなします。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">第14条（権利義務の譲渡の禁止）</h2>
                <p className="leading-relaxed">
                  ユーザーは、当サービスの書面による事前の承諾なく、
                  利用契約上の地位または本規約に基づく権利もしくは義務を第三者に譲渡し、
                  または担保に供することはできません。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">第15条（準拠法・裁判管轄）</h2>
                <ol className="list-decimal list-inside space-y-2">
                  <li className="leading-relaxed">
                    本規約の解釈にあたっては、日本法を準拠法とします。
                  </li>
                  <li className="leading-relaxed">
                    当サービスに関して紛争が生じた場合には、当サービスの所在地を管轄する裁判所を専属的合意管轄とします。
                  </li>
                </ol>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">お問い合わせ</h2>
                <p className="leading-relaxed">
                  本規約に関するお問い合わせは、以下までご連絡ください：
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
