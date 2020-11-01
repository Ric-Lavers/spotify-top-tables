import { CurrentUsersProfileResponse } from "types/spotify-api"
import Axios from "../axiosSetup"

export function getCurrentUsersProfile(): Promise<CurrentUsersProfileResponse> {
  return Axios.get("me")
}
