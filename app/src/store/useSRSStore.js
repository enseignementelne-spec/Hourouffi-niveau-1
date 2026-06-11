import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createSRSItem, processAnswer } from '../utils/srsAlgorithm'

export const useSRSStore = create(
  persist(
    (set, get) => ({
      // { profileId: { 'letter_1': srsItem, 'phoneme_2': srsItem, ... } }
      items: {},
      // { profileId: sessionCount }
      sessionCounts: {},
      // { profileId: lastDateString }
      lastSessionDates: {},

      getProfileItems: (profileId) => {
        return get().items[profileId] || {}
      },

      getItem: (profileId, itemId, itemType) => {
        const key = `${itemType}_${itemId}`
        const profileItems = get().items[profileId] || {}
        return profileItems[key] || null
      },

      recordAnswer: (profileId, itemId, itemType, isCorrect) => set(state => {
        const key = `${itemType}_${itemId}`
        const profileItems = { ...(state.items[profileId] || {}) }
        const currentItem = profileItems[key] || createSRSItem(itemId, itemType)
        const sessionCount = state.sessionCounts[profileId] || 0

        profileItems[key] = processAnswer(currentItem, isCorrect, sessionCount)

        return {
          items: { ...state.items, [profileId]: profileItems }
        }
      }),

      incrementSession: (profileId) => set(state => {
        const today = new Date().toDateString()
        const lastDate = state.lastSessionDates?.[profileId]

        if (lastDate === today) return state

        return {
          sessionCounts: {
            ...state.sessionCounts,
            [profileId]: (state.sessionCounts[profileId] || 0) + 1,
          },
          lastSessionDates: {
            ...state.lastSessionDates,
            [profileId]: today,
          }
        }
      }),

      getSessionCount: (profileId) => {
        return get().sessionCounts[profileId] || 0
      },

      resetProfile: (profileId) => set(state => {
        const newItems = { ...state.items }
        delete newItems[profileId]
        const newCounts = { ...state.sessionCounts }
        delete newCounts[profileId]
        const newDates = { ...state.lastSessionDates }
        delete newDates[profileId]
        return { items: newItems, sessionCounts: newCounts, lastSessionDates: newDates }
      }),
    }),
    { name: 'hurufi-srs' }
  )
)
