/**
 * Utilitaire de surveillance de la performance pédagogique
 */
export const AuditingMetrics = {
  track: ({ module, type, component, metadata = {} }) => {
    // Dans une version de production, on enverrait ceci à un serveur
    // Pour l'instant, on logue dans la console avec un style distinct
    console.log(
      `%c[Metric] %c${module} %c${type} %c(${component})`,
      'color: #0d9488; font-weight: bold',
      'color: #000; font-weight: bold',
      'color: #666',
      'color: #999',
      metadata
    )
    
    // Possibilité de stocker localement pour le dashboard maîtresse
    const metrics = JSON.parse(localStorage.getItem('hurufi-metrics') || '[]')
    metrics.push({
      date: new Date().toISOString(),
      module,
      type,
      component,
      ...metadata
    })
    // Garder seulement les 100 dernières
    localStorage.setItem('hurufi-metrics', JSON.stringify(metrics.slice(-100)))
  }
}
