import {
  UsersTopArtistsResponse,
  UsersTopTracksResponse,
} from "types/spotify-api"
import Axios from "services/axiosSetup"

export function getAllTop(): Promise<{
  track_short_term: UsersTopTracksResponse
  track_medium_term: UsersTopTracksResponse
  track_long_term: UsersTopTracksResponse

  artist_short_term: UsersTopArtistsResponse
  artist_medium_term: UsersTopArtistsResponse
  artist_long_term: UsersTopArtistsResponse
}> {
  return Axios.get("me/top/all")
}
