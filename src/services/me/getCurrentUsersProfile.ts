import { CurrentUsersProfileResponse } from "types/spotify-api"
import Axios from "../axiosSetup"

export async function getCurrentUsersProfile(): Promise<CurrentUsersProfileResponse> {
  try {
    const Profile: CurrentUsersProfileResponse = await Axios.get("me")
    console.log(Profile)

    document.cookie = `spotify_user_id=${Profile.id}`
    sessionStorage.setItem("spotify_user_id", Profile.id)
    return Profile
  } catch (error) {
    console.log(error)

    throw error
  }
}
