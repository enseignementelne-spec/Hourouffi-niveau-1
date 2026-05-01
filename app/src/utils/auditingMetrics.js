/**
 * Utilitaire de surveillance de la performance pédagogique
 * V3 — Timing comportemental, sessions, analyse de difficulté, alertes
 */

const STORAGE_KEY = 'hurufi-metrics'
const SESSIONS_KEY = 'hurufi-sessions'
const MAX_ENTRIES = 1000

// --- Storage Helpers ---

function loadMetrics() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function saveMetrics(metrics) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(metrics.slice(-MAX_ENTRIES)))
}

function loadSessions() {
  try {
    return JSON.parse(localStorage.getItem(SESSIONS_KEY) || '{}')
  } catch {
    return {}
  }
}

function saveSessions(sessions) {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))
}

// --- Difficulty & Confidence Helpers ---

/**
 * Calcule un score de difficulté de 1 à 5 pour une question
 * @param {Object} params
 * @param {string} [params.questionText] - Texte de la question
 * @param {number} [params.optionCount] - Nombre de choix proposés
 * @param {boolean} [params.hasAudio] - La question utilise un fichier audio
 * @param {string} [params.module] - Nom du module
 * @returns {number} Score 1-5
 */
export function calculateDifficulty({ questionText = '', optionCount = 2, hasAudio = false, module = '' }) {
  const wordCount = questionText.split(/\s+/).filter(Boolean).length
  let score = 1

  // Plus de mots = plus difficile
  score += Math.min(2, Math.floor(wordCount / 4))

  // Plus de choix = plus difficile
  if (optionCount > 2) score += 1
  if (optionCount > 4) score += 1

  // L'audio aide = légèrement plus facile
  if (hasAudio) score = Math.max(1, score - 1)

  // Certains modules sont intrinsèquement plus difficiles
  if (module === 'phonemes') score = Math.min(5, score + 1)

  return Math.min(5, Math.max(1, score))
}

/**
 * Estime la confiance de l'utilisateur basée sur le temps de réponse
 * @param {number} responseTimeMs - Temps de réponse en millisecondes
 * @param {number} difficulty - Difficulté 1-5
 * @returns {'high'|'medium'|'low'}
 */
export function estimateConfidence(responseTimeMs, difficulty = 2) {
  const adjustedThreshold = 2000 + (difficulty * 1000) // Plus de temps alloué pour les questions difficiles
  if (responseTimeMs < adjustedThreshold * 0.5) return 'high'
  if (responseTimeMs < adjustedThreshold) return 'medium'
  return 'low'
}

// --- Main Module ---

export const AuditingMetrics = {

  // ===========================
  // SESSION MANAGEMENT
  // ===========================

  /**
   * Démarrer une session de jeu
   * @param {string} sessionId - Identifiant unique de la session
   * @param {string} profileId - ID du profil élève
   * @param {string} module - Nom du module
   * @returns {string} sessionId
   */
  startSession: (sessionId, profileId, module) => {
    const sessions = loadSessions()
    sessions[sessionId] = {
      startTime: Date.now(),
      profileId,
      module,
      events: 0,
      correct: 0,
      errors: 0,
    }
    saveSessions(sessions)

    AuditingMetrics.track({
      module,
      type: 'session-start',
      component: module,
      profileId,
      metadata: { sessionId }
    })

    return sessionId
  },

  /**
   * Terminer une session de jeu et calculer les résumés
   * @param {string} sessionId
   * @returns {Object|null} Résumé de la session
   */
  endSession: (sessionId) => {
    const sessions = loadSessions()
    const session = sessions[sessionId]
    if (!session) return null

    const duration = Date.now() - session.startTime
    session.endTime = Date.now()
    session.duration = duration
    saveSessions(sessions)

    AuditingMetrics.track({
      module: session.module,
      type: 'session-end',
      component: session.module,
      profileId: session.profileId,
      metadata: {
        sessionId,
        duration,
        events: session.events,
        correct: session.correct,
        errors: session.errors,
        successRate: session.events > 0
          ? Math.round((session.correct / Math.max(1, session.correct + session.errors)) * 100)
          : 0
      }
    })

    return {
      sessionId,
      duration,
      ...session
    }
  },

  /**
   * Obtenir le temps écoulé depuis le début d'une session
   * @param {string} sessionId
   * @returns {number} Durée en ms (0 si session inconnue)
   */
  getSessionElapsed: (sessionId) => {
    const sessions = loadSessions()
    const session = sessions[sessionId]
    return session ? Date.now() - session.startTime : 0
  },

  // ===========================
  // EVENT TRACKING
  // ===========================

  /**
   * Enregistrer un événement pédagogique enrichi
   * @param {Object} params
   * @param {string} params.module - Nom du module
   * @param {string} params.type - Type d'événement (session-start, session-end, correct, error, complete, skip)
   * @param {string} params.component - Composant source
   * @param {string} [params.profileId] - ID du profil élève
   * @param {string} [params.profileName] - Prénom de l'élève
   * @param {Object} [params.metadata] - Données additionnelles (responseTime, sessionId, difficulty, confidence, etc.)
   */
  track: ({ module, type, component, profileId = null, profileName = null, metadata = {} }) => {
    const enriched = {
      date: new Date().toISOString(),
      timestamp: Date.now(),
      module,
      type,
      component,
      profileId,
      profileName,
      ...metadata
    }

    // Mettre à jour la session si sessionId présent
    if (metadata.sessionId) {
      const sessions = loadSessions()
      const session = sessions[metadata.sessionId]
      if (session) {
        session.events = (session.events || 0) + 1
        if (type === 'correct') session.correct = (session.correct || 0) + 1
        if (type === 'error') session.errors = (session.errors || 0) + 1
        saveSessions(sessions)
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log(
        `%c[Metric] %c${module} %c${type} %c(${component})`,
        'color: #0d9488; font-weight: bold',
        'color: #000; font-weight: bold',
        'color: #666',
        'color: #999',
        enriched
      )
    }

    const metrics = loadMetrics()
    metrics.push(enriched)
    saveMetrics(metrics)
  },

  // ===========================
  // QUERIES
  // ===========================

  /**
   * Récupérer les métriques filtrées pour un profil donné
   * @param {string} profileId
   * @returns {Array}
   */
  getByProfile: (profileId) => {
    return loadMetrics().filter(m => m.profileId === profileId)
  },

  /**
   * Récupérer les métriques filtrées par module
   * @param {string} moduleName
   * @returns {Array}
   */
  getByModule: (moduleName) => {
    return loadMetrics().filter(m => m.module === moduleName)
  },

  // ===========================
  // ANALYTICS
  // ===========================

  /**
   * Résumé analytique enrichi par profil
   * @param {string} profileId
   * @returns {Object|null}
   */
  getProfileSummary: (profileId) => {
    const entries = loadMetrics().filter(m => m.profileId === profileId)
    if (entries.length === 0) return null

    const totalEvents = entries.length
    const correctEvents = entries.filter(m => m.type === 'correct').length
    const errorEvents = entries.filter(m => m.type === 'error').length
    const successRate = (correctEvents + errorEvents) > 0
      ? Math.round((correctEvents / (correctEvents + errorEvents)) * 100)
      : 0

    // Temps de réponse moyen
    const responseTimes = entries
      .filter(m => typeof m.responseTime === 'number' && m.responseTime > 0)
      .map(m => m.responseTime)
    const avgResponseTime = responseTimes.length > 0
      ? Math.round(responseTimes.reduce((s, t) => s + t, 0) / responseTimes.length)
      : null

    // Module le plus utilisé
    const moduleCounts = {}
    entries.forEach(m => {
      if (m.module) moduleCounts[m.module] = (moduleCounts[m.module] || 0) + 1
    })
    const favoriteModule = Object.entries(moduleCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || null

    // Distribution de confiance
    const confidenceDist = { high: 0, medium: 0, low: 0 }
    entries.forEach(m => {
      if (m.confidence && confidenceDist[m.confidence] !== undefined) {
        confidenceDist[m.confidence]++
      }
    })

    // Première et dernière activité
    const dates = entries.map(m => new Date(m.date)).sort((a, b) => a - b)
    const firstActivity = dates[0]?.toISOString() || null
    const lastActivity = dates[dates.length - 1]?.toISOString() || null

    return {
      profileId,
      profileName: entries.find(m => m.profileName)?.profileName || null,
      totalEvents,
      correctEvents,
      errorEvents,
      successRate,
      avgResponseTime,
      favoriteModule,
      moduleCounts,
      confidenceDist,
      firstActivity,
      lastActivity,
    }
  },

  /**
   * Résumé global de la classe
   * @returns {Object}
   */
  getClassSummary: () => {
    const metrics = loadMetrics()
    const profileIds = [...new Set(metrics.filter(m => m.profileId).map(m => m.profileId))]

    const allResponseTimes = metrics
      .filter(m => typeof m.responseTime === 'number' && m.responseTime > 0)
      .map(m => m.responseTime)

    return {
      totalProfiles: profileIds.length,
      totalEvents: metrics.length,
      avgResponseTime: allResponseTimes.length > 0
        ? Math.round(allResponseTimes.reduce((s, t) => s + t, 0) / allResponseTimes.length)
        : null,
      profiles: profileIds.map(id => AuditingMetrics.getProfileSummary(id)).filter(Boolean),
    }
  },

  /**
   * Analyse de performance par module avec temps de réponse
   * @returns {Object}
   */
  getModulePerformance: () => {
    const metrics = loadMetrics()
    const modules = ['ecoute', 'memory', 'phonemes', 'tracage', 'flashcards', 'conversation']
    const result = {}

    modules.forEach(mod => {
      const entries = metrics.filter(m => m.module === mod)
      const correct = entries.filter(m => m.type === 'correct').length
      const errors = entries.filter(m => m.type === 'error').length
      const total = correct + errors

      const responseTimes = entries
        .filter(m => typeof m.responseTime === 'number' && m.responseTime > 0)
        .map(m => m.responseTime)
      const avgResponseTime = responseTimes.length > 0
        ? Math.round(responseTimes.reduce((s, t) => s + t, 0) / responseTimes.length)
        : null

      result[mod] = {
        totalInteractions: entries.length,
        correct,
        errors,
        successRate: total > 0 ? Math.round((correct / total) * 100) : 0,
        avgResponseTime,
      }
    })

    return result
  },

  // ===========================
  // ALERTS (Détection de difficultés)
  // ===========================

  /**
   * Détecter les élèves en difficulté
   * Critères : taux de réussite < 40% avec au moins 5 interactions
   * @returns {Array} Profils en alerte
   */
  getStrugglingProfiles: () => {
    const classSummary = AuditingMetrics.getClassSummary()
    return classSummary.profiles.filter(p =>
      p.successRate < 40 && (p.correctEvents + p.errorEvents) >= 5
    )
  },

  /**
   * Détecter les modules problématiques pour un élève
   * @param {string} profileId
   * @returns {Array} Modules où le taux de réussite est faible
   */
  getWeakModules: (profileId) => {
    const entries = loadMetrics().filter(m => m.profileId === profileId)
    const modules = ['ecoute', 'memory', 'phonemes', 'tracage', 'flashcards', 'conversation']
    const weak = []

    modules.forEach(mod => {
      const modEntries = entries.filter(m => m.module === mod)
      const correct = modEntries.filter(m => m.type === 'correct').length
      const errors = modEntries.filter(m => m.type === 'error').length
      const total = correct + errors
      if (total >= 3 && (correct / total) < 0.4) {
        weak.push({ module: mod, successRate: Math.round((correct / total) * 100), total })
      }
    })

    return weak
  },

  // ===========================
  // EXPORT & DATA MANAGEMENT
  // ===========================

  /**
   * Résumé d'une session spécifique
   * @param {string} sessionId
   * @returns {Object|null}
   */
  getSessionSummary: (sessionId) => {
    const sessions = loadSessions()
    const session = sessions[sessionId]
    if (!session) return null

    const metrics = loadMetrics().filter(m => m.sessionId === sessionId)
    const responseTimes = metrics
      .filter(m => typeof m.responseTime === 'number')
      .map(m => m.responseTime)

    return {
      sessionId,
      profileId: session.profileId,
      module: session.module,
      startTime: session.startTime,
      duration: session.duration || (Date.now() - session.startTime),
      totalInteractions: session.events || 0,
      correct: session.correct || 0,
      errors: session.errors || 0,
      successRate: (session.correct + session.errors) > 0
        ? Math.round((session.correct / (session.correct + session.errors)) * 100)
        : 0,
      avgResponseTime: responseTimes.length > 0
        ? Math.round(responseTimes.reduce((s, t) => s + t, 0) / responseTimes.length)
        : null,
    }
  },

  /**
   * Exporter toutes les métriques en JSON
   * @returns {string}
   */
  exportJSON: () => {
    return JSON.stringify({
      metrics: loadMetrics(),
      sessions: loadSessions(),
      exportDate: new Date().toISOString(),
    }, null, 2)
  },

  /** Effacer toutes les métriques */
  clear: () => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(SESSIONS_KEY)
  },

  /** Obtenir toutes les métriques brutes */
  getAll: () => loadMetrics(),
}
