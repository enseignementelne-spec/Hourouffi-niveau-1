/**
 * Waypoints de traçage pour les 12 lettres prioritaires
 * Coordonnées sur canvas 400×400 ; lettre ghost à 12rem centrée (~y:90-300)
 * Zones élargies (65-75px) pour mieux guider les enfants
 * Ordre de tracé conforme à la calligraphie arabe standard
 */

export const letterWaypoints = {
  // ا (Alif) — Un seul trait vertical de haut en bas
  1: {
    zones: [
      { x: 170, y: 90,  w: 60, h: 65, order: 1, label: 'أعلى'  },
      { x: 170, y: 180, w: 60, h: 65, order: 2, label: 'وسط'   },
      { x: 170, y: 265, w: 60, h: 65, order: 3, label: 'أسفل'  },
    ],
    minZonesRequired: 2,
  },

  // ح (Haa) — Courbe ouverte : commence en haut à droite, descend, remonte à gauche
  2: {
    zones: [
      { x: 255, y: 110, w: 75, h: 65, order: 1, label: 'بداية يمين' },
      { x: 155, y: 235, w: 75, h: 65, order: 2, label: 'قعر'        },
      { x: 60,  y: 145, w: 75, h: 65, order: 3, label: 'خروج يسار' },
    ],
    minZonesRequired: 2,
  },

  // د (Daal) — Petit arc : haut-droite → bas → sortie gauche horizontale
  3: {
    zones: [
      { x: 240, y: 110, w: 70, h: 65, order: 1, label: 'أعلى يمين'  },
      { x: 185, y: 220, w: 70, h: 65, order: 2, label: 'انحناء'      },
      { x: 105, y: 165, w: 70, h: 65, order: 3, label: 'خروج يسار'  },
    ],
    minZonesRequired: 2,
  },

  // ر (Raa) — Crochet vers le bas : commence en haut, descend à droite
  4: {
    zones: [
      { x: 185, y: 115, w: 70, h: 65, order: 1, label: 'بداية'    },
      { x: 205, y: 210, w: 70, h: 65, order: 2, label: 'انحدار'   },
      { x: 155, y: 305, w: 70, h: 60, order: 3, label: 'نهاية'    },
    ],
    minZonesRequired: 2,
  },

  // س (Siin) — Trois dents de droite à gauche puis descente
  5: {
    zones: [
      { x: 275, y: 175, w: 70, h: 65, order: 1, label: 'سنّ ١'   },
      { x: 195, y: 150, w: 70, h: 65, order: 2, label: 'سنّ ٢'   },
      { x: 115, y: 180, w: 70, h: 65, order: 3, label: 'سنّ ٣'   },
      { x: 45,  y: 245, w: 70, h: 60, order: 4, label: 'ذيل'      },
    ],
    minZonesRequired: 2,
  },

  // ص (Saad) — Boucle arrondie + queue vers la gauche
  6: {
    zones: [
      { x: 260, y: 135, w: 75, h: 65, order: 1, label: 'دخول يمين' },
      { x: 200, y: 240, w: 75, h: 65, order: 2, label: 'قعر الحلقة'},
      { x: 90,  y: 180, w: 75, h: 65, order: 3, label: 'خروج يسار' },
    ],
    minZonesRequired: 2,
  },

  // ط (Taa) — Coupe ouverte + trait vertical à droite
  7: {
    zones: [
      { x: 230, y: 80,  w: 65, h: 70, order: 1, label: 'عمود عمودي' },
      { x: 225, y: 190, w: 70, h: 65, order: 2, label: 'يمين الكوب' },
      { x: 110, y: 230, w: 70, h: 65, order: 3, label: 'قعر الكوب'  },
    ],
    minZonesRequired: 2,
  },

  // ع (Ayn) — Tête ouverte en haut puis descente en S
  8: {
    zones: [
      { x: 240, y: 95,  w: 70, h: 65, order: 1, label: 'رأس مفتوح' },
      { x: 175, y: 195, w: 70, h: 65, order: 2, label: 'خصر'        },
      { x: 135, y: 290, w: 75, h: 65, order: 3, label: 'ذيل'         },
    ],
    minZonesRequired: 2,
  },

  // ل (Laam) — Trait vertical puis crochet vers la gauche en bas
  9: {
    zones: [
      { x: 180, y: 75,  w: 60, h: 65, order: 1, label: 'أعلى'   },
      { x: 180, y: 185, w: 60, h: 65, order: 2, label: 'وسط'    },
      { x: 115, y: 295, w: 75, h: 60, order: 3, label: 'انعطاف' },
    ],
    minZonesRequired: 2,
  },

  // م (Miim) — Boucle puis queue descendante
  10: {
    zones: [
      { x: 250, y: 150, w: 70, h: 65, order: 1, label: 'دخول يمين' },
      { x: 195, y: 250, w: 70, h: 65, order: 2, label: 'قاع الحلقة'},
      { x: 135, y: 315, w: 70, h: 60, order: 3, label: 'ذيل'        },
    ],
    minZonesRequired: 2,
  },

  // و (Waaw) — Petit cercle puis queue descendante
  11: {
    zones: [
      { x: 205, y: 110, w: 70, h: 65, order: 1, label: 'أعلى الدائرة'  },
      { x: 235, y: 205, w: 70, h: 65, order: 2, label: 'يمين الدائرة' },
      { x: 180, y: 300, w: 70, h: 60, order: 3, label: 'ذيل'           },
    ],
    minZonesRequired: 2,
  },

  // ه (Haa) — Boucle ovale fermée
  12: {
    zones: [
      { x: 240, y: 150, w: 70, h: 65, order: 1, label: 'يمين'  },
      { x: 175, y: 255, w: 75, h: 60, order: 2, label: 'أسفل'  },
      { x: 100, y: 150, w: 70, h: 65, order: 3, label: 'يسار'  },
    ],
    minZonesRequired: 2,
  },
}

/** Check if a point is inside a zone */
function isInZone(x, y, zone) {
  return x >= zone.x && x <= zone.x + zone.w &&
         y >= zone.y && y <= zone.y + zone.h
}

/**
 * Validate a drawing trace against letter waypoints
 * @param {number} letterId - ID of the letter
 * @param {Array<{x: number, y: number}>} tracePoints - Points recorded during drawing
 * @returns {{ valid: boolean, score: number, hitCount: number, totalZones: number, zones: Array }}
 */
export function validateTrace(letterId, tracePoints) {
  const config = letterWaypoints[letterId]
  if (!config) return { valid: true, score: 1, hitCount: 0, totalZones: 0, zones: [] }

  const zones = config.zones.map(z => ({ ...z, hit: false }))
  let lastHitOrder = 0

  for (const point of tracePoints) {
    for (const zone of zones) {
      if (!zone.hit && isInZone(point.x, point.y, zone)) {
        if (zone.order >= lastHitOrder) {
          zone.hit = true
          lastHitOrder = zone.order
        }
      }
    }
  }

  const hitCount = zones.filter(z => z.hit).length
  const required = config.minZonesRequired || zones.length
  const score = hitCount / zones.length

  return { valid: hitCount >= required, score, hitCount, totalZones: zones.length, zones }
}
