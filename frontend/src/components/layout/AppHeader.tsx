"use client"

import Link from "next/link"
import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useAuth } from "@/contexts/AuthContext"

export function AppHeader() {
    const { isAuthenticated } = useAuth()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (<>
        {/* warning解消用 */}
        <div></div>
        <motion.header
            className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 shadow-sm text-slate-900"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 md:h-20 items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2 group">
                        <motion.div
                            transition={{ duration: 0.6 }}
                            className="text-3xl md:text-4xl"
                        >
                            <img src="/header-prod.png" className="h-16 md:h-20 w-auto drop-shadow-md" alt="Musical" />
                        </motion.div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
                        {isAuthenticated ? (

                            <div className="flex items-center gap-3">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        href="/settings"
                                        className="px-4 lg:px-5 py-2 text-slate-700 hover:text-slate-900 font-medium transition-colors duration-200"
                                    >
                                        設定
                                    </Link>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        href="/music"
                                        className="px-4 lg:px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        音楽を送る
                                    </Link>
                                </motion.div>
                            </div>

                        ) : (
                            <>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        href="/login"
                                        className="px-4 lg:px-6 py-2 text-slate-700 hover:text-slate-900 font-medium transition-colors duration-200"
                                    >
                                        ログイン
                                    </Link>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        href="/signup"
                                        className="px-4 lg:px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        新規登録
                                    </Link>
                                </motion.div>
                            </>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden text-slate-700 p-2 hover:text-slate-900 transition-colors duration-200"
                        aria-label="メニューを開く"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {mobileMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </motion.button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden bg-white/90 backdrop-blur-lg border-t border-slate-200/80 shadow-sm text-slate-900"
                    >
                        <nav className="px-4 py-4 space-y-3">
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        href="/settings"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block px-4 py-3 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg font-medium transition-all duration-200"
                                    >
                                        設定
                                    </Link>
                                    <Link
                                        href="/music"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold text-center shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        音楽を送る
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block px-4 py-3 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg font-medium transition-all duration-200"
                                    >
                                        ログイン
                                    </Link>
                                    <Link
                                        href="/signup"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold text-center shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        新規登録
                                    </Link>
                                </>
                            )}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    </>
    )
}
