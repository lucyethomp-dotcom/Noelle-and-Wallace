import { episodes } from '../stories/episodes'

export default function sitemap() {
  const latestDate = episodes.reduce((latest, episode) => {
    const d = new Date(episode.date)
    return d > latest ? d : latest
  }, new Date(0))

  return [
    {
      url: 'https://mywebsoap.com',
      lastModified: latestDate,
      changeFrequency: 'daily',
      priority: 1,
    },
  ]
}
