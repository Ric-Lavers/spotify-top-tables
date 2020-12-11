import Axios from "services/axiosSetup"

export function getTopArtists(name: string): Promise<any> {
  return Axios.get("group/new", { params: { name } })
}
