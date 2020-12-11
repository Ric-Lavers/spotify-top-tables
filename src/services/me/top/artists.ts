import { UsersTopArtistsResponse } from "types/spotify-api"
import Axios from "services/axiosSetup"

export function getTopArtists(params: {
  [key: string]: string
}): Promise<UsersTopArtistsResponse> {
  return Axios.get("me/top/artists", { params, })
}
