import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useProfileStore, CHILD_AVATARS } from '../store/useProfileStore'
import { useGameStore } from '../store/useGameStore'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, Lock, Download, Trash2, Star, BarChart3, 
  Volume2, Play, Users, CheckCircle2, AlertCircle, 
  Settings, ChevronRight, Search, FileText
} from 'lucide-react'
import { categories } from '../data/vocabulaire'
import { alphabet } from '../data/alphabet'
import { phonemes } from '../data/phonemes'
import { conversations } from '../data/conversations'

const DEFAULT_PIN = '2026'
const PIN_STORAGE_KEY = 'hurufi-teacher-pin'

// --- HELPER COMPONENTS ---

function ResourceStatus({ url, type }) {
  const [status, setStatus] = useState('checking')
  useEffect(() => {
    if (!url) { setStatus('missing'); return }
    if (type === 'audio') {
      const a = new Audio(url)
      a.oncanplaythrough = () => setStatus('ok')
      a.onerror = () => setStatus('error')
      a.load()
    } else {
      const img = new Image()
      img.onload = () => setStatus('ok')
      img.onerror = () => setStatus('error')
      img.src = url
    }
  }, [url, type])

  if (status === 'checking') return <div className="h-2 w-8 bg-slate-100 rounded-full animate-pulse" />
  if (status === 'ok') return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
  return <AlertCircle className="h-4 w-4 text-rose-500" />
}

function ProgressCard({ label, value, colorClass }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
        <span className={`text-xs font-black ${colorClass}`}>{value}</span>
      </div>
      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
        <div className={`h-full ${colorClass.replace('text-', 'bg-')} rounded-full transition-all duration-1000`} 
             style={{ width: `${Math.min(100, (value / 20) * 100)}%` }} />
      </div>
    </div>
  )
}

// --- MAIN COMPONENT ---

export default function DashboardMaitresse() {
  const profiles = useProfileStore(s => s.profiles)
  const deleteAllProfiles = useProfileStore(s => s.deleteAllProfiles)
  const getStats = useGameStore(s => s.getStats)
  const resetProfile = useGameStore(s => s.resetProfile)
  const getResultsForExport = useGameStore(s => s.getResultsForExport)

  const [pin, setPin] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('students') 
  const [playingId, setPlayingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const savedPin = localStorage.getItem(PIN_STORAGE_KEY) || DEFAULT_PIN

  const handlePin = () => { if (pin === savedPin) setAuthenticated(true) }

  const playPreview = (url, id) => {
    setPlayingId(id)
    const audio = new Audio(url)
    audio.play().catch(e => console.error('Audio error:', e))
    audio.onended = () => setPlayingId(null)
  }

  if (!authenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
          className="w-full max-w-md bg-white rounded-[2.5rem] card-shadow p-10 border border-slate-100 text-center">
          <div className="w-20 h-20 bg-brand-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Lock className="h-10 w-10 text-brand-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-2">فضاء المعلمة</h2>
          <p className="text-slate-500 font-medium mb-8">Espace Maîtresse Sécurisé</p>
          
          <div className="space-y-4">
            <input
              type="password" value={pin} onChange={e => setPin(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handlePin()}
              placeholder="••••" autoFocus
              className="w-full p-5 rounded-2xl border-2 border-slate-100 focus:border-brand-400 focus:ring-4 focus:ring-brand-50 outline-none font-black text-center text-4xl tracking-[0.5em] bg-slate-50 transition-all"
            />
            <button onClick={handlePin} className="w-full p-5 rounded-2xl bg-brand-600 text-white font-black text-lg hover:bg-brand-700 shadow-lg shadow-brand-200 transition-all active:scale-95">
              دخول
            </button>
            <p className="text-sm text-slate-400">💡 Code par défaut : <span className="font-bold text-brand-500">2026</span></p>
          </div>
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-600 font-bold text-sm mt-8 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Retour à l'accueil
          </Link>
        </motion.div>
      </div>
    )
  }

  const menuItems = [
    { id: 'students', label: 'Suivi des élèves', icon: Users, color: 'text-blue-500' },
    { id: 'audio', label: 'Audit des sons', icon: Volume2, color: 'text-purple-500' },
    { id: 'assets', label: 'État des médias', icon: FileText, color: 'text-emerald-500' },
    { id: 'settings', label: 'Paramètres', icon: Settings, color: 'text-slate-500' },
  ]

  return (
    <div className="flex flex-col md:flex-row min-h-[90vh] gap-6" dir="ltr">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white rounded-[2rem] card-shadow p-4 sticky top-6 border border-slate-100">
          <div className="px-4 py-6 mb-4">
            <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white text-xs">H</div>
              Hurûfî Pro
            </h1>
          </div>
          <nav className="space-y-1">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all ${
                  activeTab === item.id 
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-100' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <item.icon className={`h-5 w-5 ${activeTab === item.id ? 'text-white' : item.color}`} />
                {item.label}
              </button>
            ))}
          </nav>
          <div className="mt-8 pt-6 border-t border-slate-50">
            <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-400 hover:text-brand-600 font-bold text-sm transition-colors">
              <ArrowLeft className="h-4 w-4" /> Quitter l'espace
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-800">
              {menuItems.find(i => i.id === activeTab)?.label}
            </h2>
            <p className="text-slate-400 font-medium text-sm">Gestion pédagogique et technique</p>
          </div>
          {activeTab === 'students' && (
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" placeholder="Rechercher un élève..." 
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="pl-11 pr-6 py-3 rounded-2xl bg-white border border-slate-100 card-shadow outline-none focus:border-brand-400 w-full sm:w-64 font-medium text-sm"
              />
            </div>
          )}
        </header>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="pb-10"
          >
            {activeTab === 'students' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {profiles.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
                      <Users className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                      <p className="text-slate-400 font-bold">Aucun élève enregistré pour le moment.</p>
                    </div>
                  ) : (
                    profiles
                      .filter(p => p.prenom.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((p) => {
                        const stats = getStats(p.id)
                        return (
                          <div key={p.id} className="bg-white rounded-[2rem] card-shadow p-6 border border-slate-50 group hover:border-brand-200 transition-all">
                            <div className="flex items-start justify-between mb-6">
                              <div className="flex items-center gap-4">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-sm ${p.avatarColor || 'bg-slate-100'}`}>
                                  {CHILD_AVATARS.find(a => a.img === p.avatar)?.emoji || '👤'}
                                  {p.avatar && p.avatar.includes('http') || p.avatar.includes('assets') ? (
                                     <img src={p.avatar} alt="" className="w-12 h-12 object-contain" />
                                  ) : null}
                                </div>
                                <div>
                                  <h3 className="text-xl font-black text-slate-800">{p.prenom}</h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="px-2 py-0.5 rounded-md bg-gold-100 text-gold-600 font-black text-[10px] uppercase">Niveau {p.niveau}</span>
                                    <span className="text-slate-400 font-bold text-xs">⭐ {p.pointsTotal} pts</span>
                                  </div>
                                </div>
                              </div>
                              <button onClick={() => { if(confirm(`Réinitialiser ${p.prenom} ?`)) resetProfile(p.id) }} 
                                className="p-2 rounded-xl text-slate-300 hover:text-coral-500 hover:bg-coral-50 transition-all opacity-0 group-hover:opacity-100">
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                              <ProgressCard label="Écoute" value={stats.ecoute?.correct || 0} colorClass="text-blue-500" />
                              <ProgressCard label="Mémoire" value={stats.memory?.completed || 0} colorClass="text-purple-500" />
                              <ProgressCard label="Phonèmes" value={stats.phonemes?.correct || 0} colorClass="text-emerald-500" />
                              <ProgressCard label="Tracé" value={stats.tracage?.completed || 0} colorClass="text-orange-500" />
                              <ProgressCard label="Flash" value={stats.flashcards?.vus || 0} colorClass="text-pink-500" />
                              <div className="bg-brand-50 rounded-2xl p-3 flex flex-col justify-center items-center text-center">
                                <span className="text-[10px] font-bold text-brand-400 uppercase">Streak</span>
                                <span className="text-lg font-black text-brand-600">🔥 {stats.streak}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 border-t border-slate-50 pt-4">
                              <span>Dernière activité : Aujourd'hui</span>
                              <span>Total Sessions : {stats.totalSessions}</span>
                            </div>
                          </div>
                        )
                      })
                  )}
                </div>
              </div>
            )}

            {activeTab === 'audio' && (
              <div className="space-y-8">
                {/* Simplified Audio Grid */}
                <section className="bg-white rounded-[2rem] card-shadow p-8 border border-slate-50">
                  <header className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-black text-slate-800">Audit Vocal : Alphabet</h3>
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase">28 Fichiers</span>
                  </header>
                  <div className="grid grid-cols-4 sm:grid-cols-7 lg:grid-cols-10 gap-3">
                    {alphabet.map(l => (
                      <button 
                        key={l.id} onClick={() => playPreview(l.audio, `lettre-${l.id}`)}
                        className={`group relative h-14 rounded-2xl border-2 flex items-center justify-center transition-all ${
                          playingId === `lettre-${l.id}` ? 'bg-brand-600 border-brand-600 text-white shadow-lg scale-105' : 'bg-white border-slate-100 hover:border-brand-200 text-slate-700'
                        }`}
                      >
                        <span className="font-arabic text-xl">{l.lettre}</span>
                        <div className={`absolute bottom-1 right-1 transition-opacity ${playingId === `lettre-${l.id}` ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                          <Play className="h-2 w-2" />
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="bg-white rounded-[2rem] card-shadow p-8 border border-slate-50">
                  <header className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-black text-slate-800">Phonèmes & Vocabulaire</h3>
                    <div className="flex gap-2">
                       <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase">6 Paires</span>
                       <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase">100+ Mots</span>
                    </div>
                  </header>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                     {phonemes.map(p => (
                       <button 
                        key={p.id} onClick={() => playPreview(p.audio, `phoneme-${p.id}`)}
                        className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                          playingId === `phoneme-${p.id}` ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' : 'bg-slate-50 border-transparent hover:border-slate-200'
                        }`}
                       >
                         <span className="font-arabic text-lg" dir="rtl">{p.lettre1.caractere} / {p.lettre2.caractere}</span>
                         <Volume2 className="h-4 w-4 opacity-50" />
                       </button>
                     ))}
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'assets' && (
              <div className="bg-white rounded-[2.5rem] card-shadow overflow-hidden border border-slate-100">
                <div className="p-8 bg-slate-50 border-b border-slate-100">
                   <h3 className="text-lg font-black text-slate-800 mb-1 text-right" dir="rtl">بيان حالة الوسائط</h3>
                   <p className="text-slate-500 text-sm font-medium text-right" dir="rtl">تحقق من توفر الصور والأصوات في الخادم.</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-right" dir="rtl">
                    <thead className="bg-white">
                      <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-50">
                        <th className="p-6">المادة</th>
                        <th className="p-6 text-center">الصوت</th>
                        <th className="p-6 text-center">الصورة</th>
                        <th className="p-6">المسار المتوقع</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      <tr className="bg-slate-50/50"><td colSpan="4" className="p-4 font-black text-brand-600 text-xs">الأبجدية (Alphabet)</td></tr>
                      {alphabet.slice(0, 12).map(l => (
                        <tr key={l.id} className="hover:bg-slate-50/30 transition-colors">
                          <td className="p-4 font-arabic font-bold text-slate-700">{l.lettre} <span className="text-[10px] text-slate-400">({l.translit})</span></td>
                          <td className="p-4 text-center"><ResourceStatus url={l.audio} type="audio" /></td>
                          <td className="p-4 text-center"><ResourceStatus url={`resources/images/lettres/lettre_${l.translit.toLowerCase()}.png`} type="image" /></td>
                          <td className="p-4 text-[10px] text-slate-300 font-mono truncate max-w-[200px]">{l.audio}</td>
                        </tr>
                      ))}
                      
                      {categories.map(cat => (
                        <React.Fragment key={cat.id}>
                          <tr className="bg-slate-50/50">
                            <td colSpan="4" className="p-4 font-black text-brand-600 text-xs">{cat.emoji} {cat.nomAr}</td>
                          </tr>
                          {cat.mots.map((m, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/30 transition-colors text-sm">
                              <td className="p-4 font-arabic font-bold text-slate-700">{m.ar} <span className="text-[10px] text-slate-400 font-normal">({m.fr})</span></td>
                              <td className="p-4 text-center"><ResourceStatus url={m.audio} type="audio" /></td>
                              <td className="p-4 text-center"><ResourceStatus url={m.image} type="image" /></td>
                              <td className="p-4 text-[10px] text-slate-300 font-mono truncate max-w-[200px]">{m.image}</td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="max-w-md mx-auto space-y-6 pt-10 text-center">
                <div className="bg-white rounded-[2rem] card-shadow p-8 border border-slate-50">
                  <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 mb-2">Zone de Danger</h3>
                  <p className="text-slate-400 text-sm font-medium mb-6">Attention, ces actions sont irréversibles.</p>
                  <button 
                    onClick={() => { if(confirm('Supprimer TOUS les profils ?')) deleteAllProfiles() }}
                    className="w-full p-4 rounded-2xl bg-rose-500 text-white font-black hover:bg-rose-600 shadow-lg shadow-rose-100 transition-all"
                  >
                    Supprimer toutes les données
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

