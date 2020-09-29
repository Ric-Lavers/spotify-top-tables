import { UsersTopTracksResponse } from "types/spotify-api"
import Axios from "services/axiosSetup"

export function getTopTracks(params: {
  [key: string]: string
}): Promise<UsersTopTracksResponse> {
  return Axios.get("me/top/tracks", { params })
}
