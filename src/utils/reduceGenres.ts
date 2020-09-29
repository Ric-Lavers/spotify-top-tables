import { ArtistObjectFull } from "../types/spotify-api"

type R = { name: string; count: number }[]
type T = (items: ArtistObjectFull[]) => R
export const reduceGenres: T = (items) => {
  return items
    .reduce((a: R, { genres }) => {
      genres.forEach((genre) => {
        const index = a.findIndex(({ name }) => name === genre)

        if (index === -1) {
          a.push({
            name: genre,
            count: 1,
          })
        } else {
          a[index].count++
        }
      })
      return a
    }, [])
    .sort((a, b) => b.count - a.count)
}
