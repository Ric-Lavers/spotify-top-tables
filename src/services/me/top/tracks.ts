import { UsersTopTracksResponse } from "types/spotify-api"
import Axios from "services/axiosSetup"

export function getTopTracks(params: {
  time_range: string
}): Promise<UsersTopTracksResponse> {
  return Axios.get("me/top/tracks", { params, })
}
