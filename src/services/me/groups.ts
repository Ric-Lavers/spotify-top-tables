import Axios from "../axiosSetup"

export interface Groups {
  _id: string
  id?: string
  name: string
}
export async function getCurrentUsersGroups(): Promise<Groups> {
  try {
    const groups: Groups = await Axios.get("me/groups")

    return groups
  } catch (error) {
    throw error
  }
}
