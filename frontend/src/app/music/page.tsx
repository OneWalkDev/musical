'use client'

import { AppHeader } from '@/components/layout/AppHeader'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { IoMusicalNotes } from 'react-icons/io5'
import { LuLink } from 'react-icons/lu'
import { FaMusic, FaUser } from 'react-icons/fa'
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md'
import { apiRequest } from '@/utils/api'

interface Genre {
  id: number
  name: string
  slug: string
}

interface MBArtist {
  id: string
  name: string
  disambiguation?: string
}

interface MBRecording {
  id: string
  title: string
  'artist-credit'?: Array<{ name: string }>
}

interface CoverArtImage {
  thumbnails: {
    small: string
    large: string
  }
  image: string
}

export default function Music() {
  const { isAuthenticated } = useAuth();

  const [url, setUrl] = useState<string>("")
  const [title, setTitle] = useState<string>("")
  const [artist, setArtist] = useState<string>("")
  const [genres, setGenres] = useState<Genre[]>([])
  const [selectedGenres, setSelectedGenres] = useState<number[]>([])
  const [isLoadingGenres, setIsLoadingGenres] = useState(false)
  const [genreSearch, setGenreSearch] = useState('')
  const MAX_GENRE_SELECTION = 3

  // MusicBrainz関連のstate
  const [artistSuggestions, setArtistSuggestions] = useState<MBArtist[]>([])
  const [titleSuggestions, setTitleSuggestions] = useState<MBRecording[]>([])
  const [selectedArtistId, setSelectedArtistId] = useState<string>("")
  const [selectedRecordingId, setSelectedRecordingId] = useState<string>("")
  const [coverArtUrl, setCoverArtUrl] = useState<string>("")
  const [isLoadingArtists, setIsLoadingArtists] = useState(false)
  const [isLoadingTitles, setIsLoadingTitles] = useState(false)
  const [showArtistSuggestions, setShowArtistSuggestions] = useState(false)
  const [showTitleSuggestions, setShowTitleSuggestions] = useState(false)
  const [artistSearched, setArtistSearched] = useState(false)
  const [titleSearched, setTitleSearched] = useState(false)
  const [artistSearchError, setArtistSearchError] = useState(false)
  const [titleSearchError, setTitleSearchError] = useState(false)
  const [manualArtistEntry, setManualArtistEntry] = useState(false)
  const [manualTitleEntry, setManualTitleEntry] = useState(false)

  // 送信エフェクト用state
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 1日1回の投稿制限チェック用state
  const [canPostToday, setCanPostToday] = useState(true)
  const [postLimitMessage, setPostLimitMessage] = useState('')

  const router = useRouter();

  // 検索でフィルタリングされたジャンル
  const filteredGenres = genres.filter(genre =>
    genre.name.toLowerCase().includes(genreSearch.toLowerCase())
  )


  function normalizeYoutubeUrl(input: string): string {
    try {
      const u = new URL(input);

      const host = u.hostname.replace(/^www\./, "");

      // youtu.be/<id>?xxx  → ?以降削除
      if (host === "youtu.be") {
        const id = u.pathname.split("/").filter(Boolean)[0];
        if (!id) return input;
        return `${u.protocol}//${u.host}/${id}`;
      }

      // youtube.com/watch?v=<id>&xxx → v だけ残して他は削除
      if (host === "youtube.com" && u.pathname === "/watch") {
        const v = u.searchParams.get("v");
        if (!v) return input;
        return `${u.protocol}//${u.host}/watch?v=${v}`;
      }

      // それ以外は一旦そのまま返す（必要ならルール追加）
      return input;
    } catch {
      // URLとして解釈できない文字列はそのまま
      return input;
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    // ユーザーのジャンル登録状況をチェック
    const checkUserGenres = async () => {
      try {
        const response = await apiRequest('/api/user-genres/')
        if (response.ok) {
          const data = await response.json()
          // ジャンルが未登録の場合、プロフィール設定画面へリダイレクト
          if (data.length === 0) {
            router.push('/profile-setup')
          }
        }
      } catch (error) {
        console.error('ユーザージャンル取得エラー:', error)
      }
    }

    checkUserGenres()
  }, [isAuthenticated, router]);

  // 本日の投稿可否をチェック & 投稿済みの場合は受信画面へリダイレクト
  useEffect(() => {
    const checkCanPostToday = async () => {
      if (!isAuthenticated) return

      try {
        const response = await apiRequest('/api/can-post/')
        if (response.ok) {
          const data = await response.json()
          setCanPostToday(data.can_post)
          setPostLimitMessage(data.message)

          // 投稿済みの場合、受け取った曲があるかチェックして待機画面へリダイレクト
          if (!data.can_post) {
            router.push('/waiting')
          }
        }
      } catch (error) {
        console.error('投稿可否チェックエラー:', error)
      }
    }

    checkCanPostToday()
  }, [isAuthenticated, router])

  // ジャンル一覧を取得
  useEffect(() => {
    const fetchGenres = async () => {
      setIsLoadingGenres(true)
      try {
        const response = await apiRequest('/api/genres/')
        if (response.ok) {
          const data = await response.json()
          setGenres(data)
        }
      } catch (error) {
        console.error('ジャンル取得エラー:', error)
      } finally {
        setIsLoadingGenres(false)
      }
    }

    if (isAuthenticated) {
      fetchGenres()
    }
  }, [isAuthenticated])

  // アーティスト名検索（手動トリガー）
  const searchArtists = async () => {
    if (artist.length < 2) {
      setArtistSuggestions([])
      setArtistSearched(false)
      setArtistSearchError(false)
      return
    }

    setIsLoadingArtists(true)
    setArtistSearchError(false)
    try {
      const response = await fetch(
        `https://musicbrainz.org/ws/2/artist?query=${encodeURIComponent(artist)}&fmt=json&limit=5`,
        {
          headers: {
            'User-Agent': 'MusicalApp/1.0.0 (contact@example.com)',
          },
        }
      )

      if (response.ok) {
        const data = await response.json()
        setArtistSuggestions(data.artists || [])
        setShowArtistSuggestions(true)
        setArtistSearched(true)
      } else {
        setArtistSearchError(true)
        setArtistSearched(true)
      }
    } catch (error) {
      console.error('アーティスト検索エラー:', error)
      setArtistSearchError(true)
      setArtistSearched(true)
    } finally {
      setIsLoadingArtists(false)
    }
  }

  // 曲名検索（手動トリガー）
  const searchRecordings = async () => {
    if (title.length < 2) {
      setTitleSuggestions([])
      setTitleSearched(false)
      setTitleSearchError(false)
      return
    }

    setIsLoadingTitles(true)
    setTitleSearchError(false)
    try {
      // アーティストIDではなくアーティスト名で検索
      const response = await fetch(
        `https://musicbrainz.org/ws/2/recording?query=recording:"${encodeURIComponent(title)}" AND artist:"${encodeURIComponent(artist)}"&fmt=json&limit=10`,
        {
          headers: {
            'User-Agent': 'MusicalApp/1.0.0 (contact@example.com)',
          },
        }
      )

      if (response.ok) {
        const data = await response.json()
        setTitleSuggestions(data.recordings || [])
        setShowTitleSuggestions(true)
        setTitleSearched(true)
      } else {
        setTitleSearchError(true)
        setTitleSearched(true)
      }
    } catch (error) {
      console.error('曲検索エラー:', error)
      setTitleSearchError(true)
      setTitleSearched(true)
    } finally {
      setIsLoadingTitles(false)
    }
  }

  // 録音が選択されたらCover Art Archiveからジャケット画像を取得
  useEffect(() => {
    const fetchCoverArt = async () => {
      if (!selectedRecordingId) {
        setCoverArtUrl('')
        return
      }

      try {
        // RecordingからリリースIDを取得
        const recordingResponse = await fetch(
          `https://musicbrainz.org/ws/2/recording/${selectedRecordingId}?inc=releases&fmt=json`,
          {
            headers: {
              'User-Agent': 'MusicalApp/1.0.0 (contact@example.com)',
            },
          }
        )

        if (recordingResponse.ok) {
          const recordingData = await recordingResponse.json()
          const releases = recordingData.releases || []

          // 最初のリリースのカバーアートを取得
          for (const release of releases) {
            try {
              const coverResponse = await fetch(
                `https://coverartarchive.org/release/${release.id}`
              )

              if (coverResponse.ok) {
                const coverData = await coverResponse.json()
                if (coverData.images && coverData.images.length > 0) {
                  // フロントカバーを探す
                  const frontCover = coverData.images.find((img: any) => img.front) || coverData.images[0]
                  setCoverArtUrl(frontCover.thumbnails?.large || frontCover.image)
                  break
                }
              }
            } catch {
              // このリリースにカバーアートがない場合は次へ
              continue
            }
          }
        }
      } catch (error) {
        console.error('カバーアート取得エラー:', error)
      }
    }

    fetchCoverArt()
  }, [selectedRecordingId])

  // アーティスト選択ハンドラー
  const handleSelectArtist = (mbArtist: MBArtist) => {
    setArtist(mbArtist.name)
    setSelectedArtistId(mbArtist.id)
    setShowArtistSuggestions(false)
    setArtistSuggestions([])
    setArtistSearched(false) // 検索済みフラグをリセット
    setManualArtistEntry(false) // 手動入力フラグもリセット
  }

  // 曲選択ハンドラー
  const handleSelectRecording = (recording: MBRecording) => {
    setTitle(recording.title)
    setSelectedRecordingId(recording.id)
    setShowTitleSuggestions(false)
    setTitleSuggestions([])
    setTitleSearched(false) // 検索済みフラグをリセット
    setManualTitleEntry(false) // 手動入力フラグもリセット
  }

  // ジャンル選択のトグル（最大3つまで）
  const toggleGenre = (genreId: number) => {
    setSelectedGenres(prev => {
      if (prev.includes(genreId)) {
        // 既に選択されている場合は解除
        return prev.filter(id => id !== genreId)
      } else {
        // 新規選択の場合、最大数チェック
        if (prev.length >= MAX_GENRE_SELECTION) {
          return prev // 最大数に達している場合は追加しない
        }
        return [...prev, genreId]
      }
    })
  }

  const handleUrlBlur = () => {
    const normalizeUrl = normalizeYoutubeUrl(url);
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}$/;
    const isYoutubeUrl = regex.test(normalizeUrl);

    if(isYoutubeUrl){
      setUrl(normalizeUrl)
    }

    console.log(isYoutubeUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // ジャンルが選択されているかチェック
    if (selectedGenres.length === 0) {
      alert('ジャンルを少なくとも1つ選択してください')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await apiRequest('/api/posts/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          title,
          artist,
          genre_ids: selectedGenres,
          primary_genre_id: selectedGenres[0], // 最初のジャンルをプライマリに
          musicbrainz_id: selectedRecordingId || null,
          cover_art_url: coverArtUrl || null,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        // アニメーション完了を待ってから受信画面にリダイレクト（1.5秒）
        setTimeout(() => {
          router.push(`/waiting`)
        }, 1500)
      } else {
        const data = await response.json()
        console.error('送信エラー:', data)
        alert(data.error || '曲の送信に失敗しました')
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error('送信エラー:', error)
      alert('曲の送信に失敗しました')
      setIsSubmitting(false)
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
        <AnimatePresence>
          {isSubmitting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
            >
              <motion.div
                initial={{ y: 0, scale: 1 }}
                animate={{
                  y: -1000,
                  scale: 0.5,
                  opacity: 0
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeIn"
                }}
                className="bg-white/85 backdrop-blur-xl rounded-3xl p-12 border border-white/60 shadow-2xl"
              >
                <div className="flex flex-col items-center gap-4">
                  <IoMusicalNotes className="text-8xl text-amber-500 animate-pulse" />
                  <p className="text-slate-900 text-2xl font-bold">曲を送信中...</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isSubmitting ? 0 : 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md relative z-10"
        >
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
              今日の1曲を送ろう
            </h1>
            <p className="text-slate-600">一番響いた曲はなんだったかな？</p>

            {/* 投稿制限メッセージ */}
            {!canPostToday && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-red-100 border border-red-200 rounded-lg"
              >
                <p className="text-red-700 font-medium">{postLimitMessage}</p>
                <p className="text-red-600 text-sm mt-1">明日また投稿できます</p>
              </motion.div>
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/85 backdrop-blur-xl rounded-3xl p-8 border border-white/60 shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="url" className="block text-slate-800 font-semibold mb-2">
                  YoutubeのURL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <LuLink/>
                  </div>
                  <input
                    type="text"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onBlur={handleUrlBlur}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-amber-100 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all duration-200 shadow-sm"
                    placeholder="YoutubeのURLを入力"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="artist" className="block text-slate-800 font-semibold mb-2">
                  アーティスト名を入力
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <FaUser/>
                  </div>
                  <input
                    type="text"
                    id="artist"
                    value={artist}
                    onChange={(e) => {
                      setArtist(e.target.value)
                      setSelectedArtistId('') // アーティスト変更時にIDをクリア
                      setTitle('') // 曲名もクリア
                      setSelectedRecordingId('')
                      setCoverArtUrl('')
                      setArtistSearched(false)
                      setArtistSearchError(false)
                      setShowArtistSuggestions(false)
                      setManualArtistEntry(false)
                    }}
                    onBlur={searchArtists}
                    onFocus={() => {
                      if (artistSuggestions.length > 0) {
                        setShowArtistSuggestions(true)
                      }
                    }}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-amber-100 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all duration-200 shadow-sm"
                    placeholder="アーティスト名を入力"
                    required
                  />

                  {/* アーティスト候補ドロップダウン */}
                  {showArtistSuggestions && artistSuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute z-10 w-full mt-2 bg-white/95 backdrop-blur-lg rounded-lg border border-white/20 shadow-xl max-h-60 overflow-y-auto"
                    >
                      {artistSuggestions.map((mbArtist) => (
                        <button
                          key={mbArtist.id}
                          type="button"
                          onClick={() => handleSelectArtist(mbArtist)}
                          className="w-full px-4 py-3 text-left hover:bg-pink-100 transition-colors duration-200 border-b border-white/40 last:border-b-0 text-slate-800"
                        >
                          <div className="font-medium">
                            {mbArtist.name}
                          </div>
                          {mbArtist.disambiguation && (
                            <div className="text-sm text-slate-600">
                              {mbArtist.disambiguation}
                            </div>
                          )}
                        </button>
                      ))}
                      {/* 手動入力オプション */}
                      <button
                        type="button"
                        onClick={() => {
                          setManualArtistEntry(true)
                          setShowArtistSuggestions(false)
                          setSelectedArtistId('')
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-200 border-t-2 border-blue-200 bg-blue-50/50 text-slate-700"
                      >
                        <div className="font-medium flex items-center gap-2">
                          <span>✏️</span>
                          <span>該当するアーティストが見つからない（手動入力）</span>
                        </div>
                      </button>
                    </motion.div>
                  )}

                  {isLoadingArtists && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-pink-500"></div>
                    </div>
                  )}
                </div>

                {/* アーティスト検索結果メッセージ */}
                {artistSearched && !isLoadingArtists && artistSuggestions.length === 0 && !artistSearchError && !manualArtistEntry && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                  >
                    <p className="text-blue-700 text-sm">
                      アーティストが見つかりませんでした。入力したアーティスト名のまま投稿できます。
                    </p>
                  </motion.div>
                )}
                {artistSearchError && !isLoadingArtists && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg"
                  >
                    <p className="text-amber-700 text-sm">
                      アーティスト検索でエラーが発生しました。入力したアーティスト名のまま投稿できます。
                    </p>
                  </motion.div>
                )}
                {manualArtistEntry && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between"
                  >
                    <p className="text-green-700 text-sm flex items-center gap-2">
                      <span>✓</span>
                      <span>手動入力モード：入力したアーティスト名で投稿します</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setManualArtistEntry(false)
                        searchArtists()
                      }}
                      className="text-green-700 hover:text-green-900 text-sm underline"
                    >
                      再検索
                    </button>
                  </motion.div>
                )}
              </div>

              <div>
                <label htmlFor="title" className="block text-slate-800 font-semibold mb-2">
                  曲名を入力
                  {!artist && (
                    <span className="text-sm text-slate-500 ml-2">
                      (先にアーティスト名を入力してください)
                    </span>
                  )}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <FaMusic/>
                  </div>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value)
                      setSelectedRecordingId('') // 曲名変更時にIDをクリア
                      setCoverArtUrl('')
                      setTitleSearched(false)
                      setTitleSearchError(false)
                      setShowTitleSuggestions(false)
                      setManualTitleEntry(false)
                    }}
                    onBlur={searchRecordings}
                    onFocus={() => {
                      if (titleSuggestions.length > 0) {
                        setShowTitleSuggestions(true)
                      }
                    }}
                    disabled={!artist}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-amber-100 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    placeholder={artist ? "曲名を入力" : "先にアーティスト名を入力してください"}
                    required
                  />

                  {/* 曲名候補ドロップダウン */}
                  {showTitleSuggestions && titleSuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute z-10 w-full mt-2 bg-white/95 backdrop-blur-lg rounded-lg border border-white/20 shadow-xl max-h-60 overflow-y-auto"
                    >
                      {titleSuggestions.map((recording) => (
                        <button
                          key={recording.id}
                          type="button"
                          onClick={() => handleSelectRecording(recording)}
                          className="w-full px-4 py-3 text-left hover:bg-pink-100 transition-colors duration-200 border-b border-white/40 last:border-b-0 text-slate-800"
                        >
                          <div className="font-medium">
                            {recording.title}
                          </div>
                          {recording['artist-credit'] && recording['artist-credit'].length > 0 && (
                            <div className="text-sm text-slate-600">
                              {recording['artist-credit'].map(ac => ac.name).join(', ')}
                            </div>
                          )}
                        </button>
                      ))}
                      {/* 手動入力オプション */}
                      <button
                        type="button"
                        onClick={() => {
                          setManualTitleEntry(true)
                          setShowTitleSuggestions(false)
                          setSelectedRecordingId('')
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-200 border-t-2 border-blue-200 bg-blue-50/50 text-slate-700"
                      >
                        <div className="font-medium flex items-center gap-2">
                          <span>✏️</span>
                          <span>該当する曲が見つからない（手動入力）</span>
                        </div>
                      </button>
                    </motion.div>
                  )}

                  {isLoadingTitles && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-pink-500"></div>
                    </div>
                  )}
                </div>

                {/* 曲名検索結果メッセージ */}
                {titleSearched && !isLoadingTitles && titleSuggestions.length === 0 && !titleSearchError && !manualTitleEntry && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                  >
                    <p className="text-blue-700 text-sm">
                      曲が見つかりませんでした。入力した曲名のまま投稿できます。
                    </p>
                  </motion.div>
                )}
                {titleSearchError && !isLoadingTitles && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg"
                  >
                    <p className="text-amber-700 text-sm">
                      曲検索でエラーが発生しました。入力した曲名のまま投稿できます。
                    </p>
                  </motion.div>
                )}
                {manualTitleEntry && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between"
                  >
                    <p className="text-green-700 text-sm flex items-center gap-2">
                      <span>✓</span>
                      <span>手動入力モード：入力した曲名で投稿します</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setManualTitleEntry(false)
                        searchRecordings()
                      }}
                      className="text-green-700 hover:text-green-900 text-sm underline"
                    >
                      再検索
                    </button>
                  </motion.div>
                )}
              </div>

              {/* カバーアート表示 */}
              {coverArtUrl && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex justify-center"
                >
                  <div className="relative">
                    <img
                      src={coverArtUrl}
                      alt="Album Cover"
                      className="w-48 h-48 rounded-lg shadow-2xl border-2 border-white/20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>
                  </div>
                </motion.div>
              )}

              {/* 手動入力についての説明 */}
              {(manualArtistEntry || manualTitleEntry) && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <p className="text-slate-700 text-sm">
                    💡 手動入力モード：入力した情報のまま投稿されます。
                  </p>
                </motion.div>
              )}

              {/* ジャンル選択 */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-white font-medium">
                    ジャンルを選択
                  </label>
                  <span className="text-sm text-slate-500">
                    {selectedGenres.length}/{MAX_GENRE_SELECTION}選択中
                  </span>
                </div>

                {isLoadingGenres ? (
                  <div className="text-slate-500 text-center py-4">読み込み中...</div>
                ) : (
                  <div className="space-y-3">
                    {/* 検索バー */}
                    <input
                      type="text"
                      value={genreSearch}
                      onChange={(e) => setGenreSearch(e.target.value)}
                      placeholder="ジャンルを検索..."
                      className="w-full px-4 py-2 bg-white border border-amber-100 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all duration-200 shadow-sm"
                    />

                    {/* 選択済みジャンル表示 */}
                    {selectedGenres.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedGenres.map(genreId => {
                          const genre = genres.find(g => g.id === genreId)
                          return genre ? (
                            <motion.div
                              key={genre.id}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-amber-400 via-pink-500 to-sky-500 text-white rounded-full text-sm shadow-sm"
                            >
                              <span>{genre.name}</span>
                              <button
                                type="button"
                                onClick={() => toggleGenre(genre.id)}
                                className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                              >
                                ✕
                              </button>
                            </motion.div>
                          ) : null
                        })}
                      </div>
                    )}

                    {/* ジャンル一覧（スクロール可能） */}
                    <div className="max-h-64 overflow-y-auto border border-amber-100 rounded-lg p-2 bg-white/70">
                      <div className="flex flex-col gap-2">
                        {filteredGenres.map((genre) => {
                          const isSelected = selectedGenres.includes(genre.id)
                          const isDisabled = !isSelected && selectedGenres.length >= MAX_GENRE_SELECTION

                          return (
                            <motion.button
                              key={genre.id}
                              type="button"
                              onClick={() => toggleGenre(genre.id)}
                              disabled={isDisabled}
                              whileHover={!isDisabled ? { scale: 1.02 } : {}}
                              whileTap={!isDisabled ? { scale: 0.98 } : {}}
                              className={`
                                flex items-center gap-2 px-3 py-2.5 rounded-lg text-left
                                font-medium transition-all duration-200 text-sm
                                ${isSelected
                                  ? 'bg-gradient-to-r from-amber-400 via-pink-500 to-sky-500 text-white border border-white/40 shadow-sm'
                                  : isDisabled
                                  ? 'bg-white text-slate-300 border border-amber-50 cursor-not-allowed'
                                  : 'bg-white text-slate-800 border border-amber-100 hover:shadow-sm'
                                }
                              `}
                            >
                              {isSelected ? (
                                <MdCheckBox className="text-lg flex-shrink-0" />
                              ) : (
                                <MdCheckBoxOutlineBlank className="text-lg flex-shrink-0" />
                              )}
                              <span className="break-words">{genre.name}</span>
                            </motion.button>
                          )
                        })}
                      </div>
                      {filteredGenres.length === 0 && (
                        <div className="text-slate-500 text-center py-4 text-sm">
                          該当するジャンルが見つかりません
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 送信ボタン */}
              <motion.button
                type="submit"
                disabled={isSubmitting || !canPostToday}
                whileHover={!isSubmitting && canPostToday ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting && canPostToday ? { scale: 0.98 } : {}}
                className="w-full py-3 bg-white text-purple-600 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '送信中...' : !canPostToday ? '本日は投稿済みです' : '曲を送る'}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </main>
    </>
  );
}
