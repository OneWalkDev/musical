import Link from 'next/link'
import { IoMusicalNotes } from 'react-icons/io5'
import { FaGithub, FaTwitter } from 'react-icons/fa'

export function AppFooter() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="relative bg-gradient-to-br from-slate-50 via-white to-slate-50 border-t border-slate-200/80 text-slate-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <img src="/header-prod.png" className='h-[70px]'/>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            1日1曲の交換で、新しい音楽との出会いを。
                            好きなジャンルで繋がる音楽交換プラットフォーム。
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                            クイックリンク
                        </h4>
                        <nav className="flex flex-col space-y-2">
                            <Link
                                href="/"
                                className="text-sm text-slate-600 hover:text-amber-600 transition-colors duration-200"
                            >
                                ホーム
                            </Link>
                            <Link
                                href="/music"
                                className="text-sm text-slate-600 hover:text-amber-600 transition-colors duration-200"
                            >
                                音楽を送る
                            </Link>
                            <Link
                                href="/signup"
                                className="text-sm text-slate-600 hover:text-amber-600 transition-colors duration-200"
                            >
                                新規登録
                            </Link>
                            <Link
                                href="/login"
                                className="text-sm text-slate-600 hover:text-amber-600 transition-colors duration-200"
                            >
                                ログイン
                            </Link>
                        </nav>
                    </div>

                    {/* Social Links */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                            ソースコード
                        </h4>
                        <div className="flex gap-3">
                            <a
                                href="https://github.com/OneWalkDev/musical"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 hover:text-slate-900 transition-all duration-200"
                                aria-label="GitHub"
                            >
                                <FaGithub className="text-xl" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-200 pt-8">
                    <p className="text-sm text-slate-600 text-center">
                        © {currentYear} Kazuho Utsunomiya. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}